import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import transactionRoutes from './routes/transaction.routes';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
const frontendUrl = process.env.FRONTEND_URL;
const allowedOrigins = ['http://localhost:3000'];
if (frontendUrl) {
  allowedOrigins.push(frontendUrl);
  // También agregar la versión sin slash final si existe
  if (frontendUrl.endsWith('/')) {
    allowedOrigins.push(frontendUrl.slice(0, -1));
  } else {
    allowedOrigins.push(frontendUrl + '/');
  }
}

app.use(cors({
  origin: (origin, callback) => {
    // Permitir solicitudes sin origen (como herramientas de API o Server-to-Server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS bloqueado para el origen:', origin);
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Admin-Key'],
  credentials: true
}));
app.use(express.json());

// Rutas
app.use('/api', transactionRoutes);

// Ruta de salud (Health check)
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', service: 'Remesa Simulator API' });
});

// Manejo de errores global
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Algo salió mal en el servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
  console.log(`🌐 Red Stellar: ${process.env.STELLAR_NETWORK || 'TESTNET'}`);
});
