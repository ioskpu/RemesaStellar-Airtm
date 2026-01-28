# CryptoRemit Backend - Node.js & Express

Este es el servidor backend para el Simulador de Remesas, encargado de la lógica de negocio, integración con la red Stellar y gestión de la base de datos.

## 🚀 Despliegue en Producción (Render)

El backend está configurado para desplegarse automáticamente en **Render** cuando se realizan cambios en la rama `main`.

### Configuración en Render:
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Root Directory**: `apps/backend`

### Variables de Entorno Requeridas:
- `DATABASE_URL`: String de conexión de PostgreSQL (ej: Neon).
- `FRONTEND_URL`: URL base de la aplicación frontend en Vercel.
- `ADMIN_API_KEY`: Token de seguridad para el panel de administración.
- `STELLAR_NETWORK`: `TESTNET` (por defecto).

## 🛠️ Desarrollo Local

1. Instalar dependencias: `npm install`
2. Configurar `.env` basado en `.env.example`.
3. Iniciar en modo desarrollo: `npm run dev`

## 📡 Endpoints Principales

- `POST /api/transactions`: Crear una nueva intención de remesa.
- `GET /api/transactions/:id`: Consultar el estado de una transacción.
- `GET /api/admin/transactions`: (Protegido) Listado de todas las transacciones.
