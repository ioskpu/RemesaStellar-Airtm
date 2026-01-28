# Documentación del Proyecto - CryptoRemit Demo

Bienvenido a la documentación oficial del Simulador de Remesas. Aquí encontrarás detalles técnicos sobre cómo funciona cada componente del sistema y cómo configurarlo desde cero.

## 📚 Secciones de Documentación

### 1. [Backend (Node.js/TypeScript)](backend.md)
Detalles sobre el servidor Express, la lógica de base de datos y cómo interactuamos con la blockchain de Stellar y Airtm.

### 2. [Frontend (Next.js/Tailwind)](frontend.md)
Información sobre la interfaz de usuario, los flujos de navegación y la integración con la API del backend.

### 3. [Guía de Configuración Stellar](stellar-setup.md)
Instrucciones paso a paso para crear tus llaves de Testnet y configurar el entorno de pruebas para recibir pagos.

---

## 🚀 Resumen del Flujo General

El sistema opera como un puente entre la red **Stellar** y **Airtm**:

1. **Frontend** solicita una transacción.
2. **Backend** registra y espera pago en Stellar.
3. **Usuario** deposita XLM en la red de pruebas.
4. **Backend** detecta el pago y libera fondos vía **Airtm Mock**.
5. **Frontend** muestra la confirmación final al usuario.
