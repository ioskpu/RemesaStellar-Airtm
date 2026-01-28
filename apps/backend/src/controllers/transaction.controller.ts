import { Request, Response } from 'express';
import { stellarService } from '../services/stellar.service';
import { query } from '../db';

export const createTransactionIntent = async (req: Request, res: Response) => {
  try {
    const { amountUsd } = req.body;

    if (!amountUsd || isNaN(Number(amountUsd))) {
      return res.status(400).json({ error: 'Monto en USD inválido' });
    }

    // Tipo de cambio fijo para la demo: 1 XLM = 0.10 USD (o 1 USD = 10 XLM)
    const EXCHANGE_RATE = 0.10;
    const amountXlm = (Number(amountUsd) / EXCHANGE_RATE).toFixed(7);

    // 1. Generar cuenta de depósito en Stellar
    const { publicKey, secret } = await stellarService.generateDepositAccount();

    // 2. Guardar en DB
    const insertQuery = `
      INSERT INTO transactions (
        status, 
        deposit_address, 
        deposit_secret, 
        amount_usd, 
        amount_xlm
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING id, deposit_address, amount_xlm, status
    `;

    const values = [
      'PENDING',
      publicKey,
      secret,
      amountUsd,
      amountXlm
    ];

    const result = await query(insertQuery, values);
    const transaction = result.rows[0];

    // 3. Iniciar escucha de pago en segundo plano (no bloqueante)
    stellarService.listenForPayment(transaction.id, transaction.deposit_address, transaction.amount_xlm);

    // 4. Responder al cliente (NUNCA enviar el secret)
    res.status(201).json({
      transactionId: transaction.id,
      depositAddress: transaction.deposit_address,
      amountXlm: transaction.amount_xlm,
      status: transaction.status,
      message: 'Intención de transacción creada. Por favor deposite los XLM indicados.'
    });

  } catch (error) {
    console.error('Error al crear intención de transacción:', error);
    res.status(500).json({ error: 'Error interno del servidor al procesar la solicitud' });
  }
};

/**
 * Consulta el estado actual de una transacción
 */
export const getTransactionStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT id, status, amount_usd, amount_xlm, deposit_address, stellar_hash, airtm_voucher_id, airtm_status, created_at FROM transactions WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transacción no encontrada' });
    }

    const tx = result.rows[0];
    res.json({
      transactionId: tx.id,
      status: tx.status,
      amountUsd: tx.amount_usd,
      amountXlm: tx.amount_xlm,
      depositAddress: tx.deposit_address,
      stellarHash: tx.stellar_hash,
      airtmVoucherId: tx.airtm_voucher_id,
      airtmStatus: tx.airtm_status,
      createdAt: tx.created_at
    });
  } catch (error) {
    console.error('Error al consultar estado de transacción:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Obtiene todas las transacciones (Solo Admin)
 */
export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const adminKey = req.header('X-Admin-Key');

    if (!adminKey || adminKey !== process.env.ADMIN_API_KEY) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    const result = await query(
      'SELECT id, status, amount_usd, amount_xlm, deposit_address, stellar_hash, airtm_voucher_id, airtm_status, created_at FROM transactions ORDER BY created_at DESC',
      []
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener transacciones para admin:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
