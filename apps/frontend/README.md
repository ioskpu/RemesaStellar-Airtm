# CryptoRemit Frontend - Next.js

Interfaz de usuario moderna para el Simulador de Remesas, construida con Next.js 15 y Tailwind CSS.

## 🚀 Despliegue en Producción (Vercel)

El frontend se despliega automáticamente en **Vercel**.

### Configuración en Vercel:
- **Framework Preset**: Next.js
- **Root Directory**: `apps/frontend`

### Variables de Entorno Requeridas:
- `NEXT_PUBLIC_API_URL`: URL completa del backend en Render incluyendo el prefijo `/api` (ej: `https://mi-backend.onrender.com/api`).
- `NEXT_PUBLIC_ADMIN_KEY`: La misma clave configurada en el backend para acceder al panel `/admin`.

## 🛠️ Desarrollo Local

1. Instalar dependencias: `npm install`
2. Iniciar servidor de desarrollo: `npm run dev`
3. Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## ✨ Características
- Diseño responsivo y modo oscuro.
- Integración con Stellar Horizon para actualizaciones en tiempo real.
- Panel de administración para seguimiento de transacciones.
