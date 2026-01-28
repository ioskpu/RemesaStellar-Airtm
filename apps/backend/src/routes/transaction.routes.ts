import { Router } from 'express';
import { createTransactionIntent, getTransactionStatus, getAllTransactions } from '../controllers/transaction.controller';

const router = Router();

// Ruta para iniciar una nueva transacción
router.post('/transactions', createTransactionIntent);

// Ruta para consultar el estado de una transacción
router.get('/transactions/:id', getTransactionStatus);

// Ruta de administración (Protegida por API Key)
router.get('/admin/transactions', getAllTransactions);

export default router;
