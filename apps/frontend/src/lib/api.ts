export interface TransactionResponse {
  transactionId: string;
  depositAddress: string;
  amountXlm: string;
  status: string;
  message: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function createTransaction(amountUsd: number): Promise<TransactionResponse> {
  try {
    const response = await fetch(`${API_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amountUsd }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear la transacción');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export async function getTransactionStatus(transactionId: string): Promise<TransactionResponse> {
  try {
    const response = await fetch(`${API_URL}/transactions/${transactionId}`);
    
    if (!response.ok) {
      throw new Error('Error al obtener el estado de la transacción');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
