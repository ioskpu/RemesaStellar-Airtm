/**
 * Interfaz que define la estructura de un Voucher de Airtm.
 */
export interface AirtmVoucher {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'cancelled';
  createdAt: string;
}

/**
 * Servicio Mock para simular la API de Airtm.
 * Permite completar el flujo de la remesa sin necesidad de credenciales reales de Sandbox.
 */
export class AirtmMockService {
  /**
   * Simula la creación de un voucher de pago.
   * @param amountUsd Monto en USD a acreditar.
   * @param reference Referencia interna de la transacción.
   */
  async createVoucher(amountUsd: number, reference: string): Promise<AirtmVoucher> {
    console.log(`[AIRTM MOCK] 📝 Creando voucher por ${amountUsd} USD para referencia ${reference}`);
    
    // Simula latencia de red de la API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const voucher: AirtmVoucher = {
      id: `vch_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`,
      amount: amountUsd,
      currency: 'USD',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    console.log(`[AIRTM MOCK] ✅ Voucher creado exitosamente: ${voucher.id}`);
    return voucher;
  }

  /**
   * Simula la verificación del estado de un voucher.
   * @param voucherId ID del voucher a consultar.
   */
  async getVoucherStatus(voucherId: string): Promise<{ status: string }> {
    console.log(`[AIRTM MOCK] 🔍 Consultando estado del voucher: ${voucherId}`);
    
    // Simula latencia de red
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // En este simulador, asumimos que si se consulta, el pago ya fue procesado.
    return { status: 'paid' };
  }
}

// Exportamos una instancia única para ser usada en toda la aplicación (Singleton)
export const airtmService = new AirtmMockService();
