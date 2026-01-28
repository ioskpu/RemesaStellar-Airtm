# Documentación del Frontend

El frontend es una aplicación moderna de página única (SPA) construida con **Next.js**, diseñada para ofrecer una experiencia de usuario rápida, segura y visualmente atractiva.

## 🚀 Tecnologías Principales
- **Next.js 15 (App Router)**: Framework de React para el renderizado y rutas.
- **Tailwind CSS**: Estilos basados en utilidades para una UI tipo Fintech.
- **Lucide React**: Biblioteca de iconos.
- **React QR Code**: Generación dinámica de códigos QR para pagos.

## 🔄 Flujo de Usuario

1. **Pantalla de Inicio (`/`)**:
   - Formulario para ingresar el monto a enviar en USD.
   - Cálculo automático de la conversión (simulada) y validación de campos.
   - Envío de datos al backend para crear la transacción.

2. **Pantalla de Pago (`/pago/[id]`)**:
   - Muestra la dirección de depósito Stellar y el código QR.
   - Implementa un **Polling Activo**: Consulta al backend cada 3 segundos para verificar si el pago ha sido detectado.
   - Muestra estados visuales (Sincronizando con Stellar, Pago detectado, etc.).

3. **Pantalla de Confirmación (`/completado/[id]`)**:
   - Se muestra automáticamente cuando el backend marca la transacción como `COMPLETED`.
   - Presenta el ID del voucher de Airtm y los detalles finales de la remesa.
   - Diseño tipo "Voucher" para fácil lectura.

## 📁 Estructura de Archivos Clave
- `src/app/page.tsx`: Formulario principal.
- `src/app/pago/[transactionId]/page.tsx`: Lógica de espera de pago y visualización de QR.
- `src/app/completado/[transactionId]/page.tsx`: Pantalla de éxito final.
- `src/lib/api.ts`: Cliente de API para comunicación con el backend.
