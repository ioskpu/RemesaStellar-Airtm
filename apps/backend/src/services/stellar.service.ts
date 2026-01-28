import * as StellarSdk from '@stellar/stellar-sdk';
import dotenv from 'dotenv';

dotenv.config();

class StellarService {
  private server: StellarSdk.Horizon.Server;
  private baseKeypair: StellarSdk.Keypair;

  constructor() {
    const horizonUrl = process.env.STELLAR_HORIZON_URL || 'https://horizon-testnet.stellar.org';
    this.server = new StellarSdk.Horizon.Server(horizonUrl);
    
    if (!process.env.STELLAR_BASE_SECRET) {
      throw new Error('STELLAR_BASE_SECRET is not defined in environment variables');
    }
    this.baseKeypair = StellarSdk.Keypair.fromSecret(process.env.STELLAR_BASE_SECRET);
  }

  /**
   * Genera una nueva cuenta de depósito y la fondea desde la cuenta base.
   * En testnet, esto activa la cuenta para que pueda recibir fondos.
   */
  async generateDepositAccount() {
    try {
      // 1. Generar par de claves aleatorio
      const newKeypair = StellarSdk.Keypair.random();
      const publicKey = newKeypair.publicKey();
      const secret = newKeypair.secret();

      console.log(`Generando cuenta de depósito: ${publicKey}`);

      // 2. Cargar la cuenta base para obtener el sequence number
      const baseAccount = await this.server.loadAccount(this.baseKeypair.publicKey());

      // 3. Crear transacción para activar la nueva cuenta
      // En Stellar, una cuenta debe ser creada con un balance mínimo (ej: 1 XLM)
      const transaction = new StellarSdk.TransactionBuilder(baseAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET,
      })
        .addOperation(
          StellarSdk.Operation.createAccount({
            destination: publicKey,
            startingBalance: '1.5', // Balance inicial para cubrir reserva base + fees de salida
          })
        )
        .setTimeout(30)
        .build();

      // 4. Firmar y enviar
      transaction.sign(this.baseKeypair);
      await this.server.submitTransaction(transaction);

      return { publicKey, secret };
    } catch (error) {
      console.error('Error en generateDepositAccount:', error);
      throw new Error('No se pudo generar la cuenta de depósito en Stellar');
    }
  }

  /**
   * Escucha pagos en una dirección específica en tiempo real.
   * Cuando detecta el pago, activa el flujo de Airtm.
   */
  async listenForPayment(transactionId: string, depositPublicKey: string, amountExpected: string) {
    console.log(`[STELLAR] 🎧 Iniciando escucha para ${depositPublicKey} (Esperado: ${amountExpected} XLM)`);

    // Importamos dinámicamente para evitar dependencias circulares si las hubiera
    const { query } = await import('../db');
    const { airtmService } = await import('./airtm-mock.service');

    // 🚀 MEJORA: Verificar si el pago ya está en la cuenta (pago retroactivo)
    // Esto resuelve el problema si el usuario paga antes de que el stream se conecte.
    const checkPastPayments = async () => {
      try {
        console.log(`[STELLAR] 🔍 Verificando pagos pasados para ${depositPublicKey}...`);
        const ops = await this.server.operations().forAccount(depositPublicKey).order('desc').limit(10).call();
        
        for (const op of ops.records) {
          if (op.type === 'payment' && op.to === depositPublicKey && parseFloat(op.amount) >= parseFloat(amountExpected)) {
            const checkTx = await query('SELECT status FROM transactions WHERE id = $1', [transactionId]);
            if (checkTx.rows[0] && checkTx.rows[0].status === 'PENDING') {
              console.log(`[STELLAR] ✅ Pago retroactivo encontrado: ${op.amount} XLM. Procesando...`);
              await processSuccess(op);
              return true;
            }
          }
        }
      } catch (e) {
        console.error('[STELLAR] ❌ Error en verificación retroactiva:', e);
      }
      return false;
    };

    const processSuccess = async (op: any) => {
      try {
        // 1. Actualizar estado en DB a RECEIVED
        await query(
          'UPDATE transactions SET status = $1, stellar_hash = $2 WHERE id = $3',
          ['RECEIVED', op.transaction_hash, transactionId]
        );

        // 2. Llamar a Airtm (Mock) para generar el voucher
        const txResult = await query('SELECT amount_usd FROM transactions WHERE id = $1', [transactionId]);
        const amountUsd = txResult.rows[0].amount_usd;

        const voucher = await airtmService.createVoucher(amountUsd, transactionId);

        // 3. Finalizar transacción en DB
        await query(
          'UPDATE transactions SET status = $1, airtm_voucher_id = $2, airtm_status = $3 WHERE id = $4',
          ['COMPLETED', voucher.id, 'paid', transactionId]
        );

        console.log(`[SYSTEM] 🎊 Remesa completada para TX: ${transactionId}`);
        closeStream();
      } catch (error) {
        console.error('[SYSTEM] ❌ Error procesando el pago:', error);
      }
    };

    const closeStream = this.server
      .operations()
      .forAccount(depositPublicKey)
      .cursor('now')
      .stream({
        onmessage: async (op: any) => {
          if (op.type === 'payment' && op.to === depositPublicKey) {
            console.log(`[STELLAR] 💰 ¡Pago detectado! Recibido: ${op.amount} XLM`);
            if (parseFloat(op.amount) >= parseFloat(amountExpected)) {
              await processSuccess(op);
            }
          }
        },
        onerror: (error) => {
          console.error('[STELLAR] ❌ Error en el stream de Horizon:', error);
        },
      });

    // Ejecutar verificación retroactiva después de 2 segundos
    setTimeout(checkPastPayments, 2000);

    // Timeout de seguridad: si no hay pago en 10 minutos, cerrar el stream (opcional para la demo)
    setTimeout(() => {
      console.log(`[STELLAR] ⏳ Timeout de escucha para ${depositPublicKey}`);
      closeStream();
    }, 10 * 60 * 1000);
  }
}

export const stellarService = new StellarService();
