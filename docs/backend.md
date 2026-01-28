# Documentación del Backend

El backend está construido con **Node.js**, **Express** y **TypeScript**. Su función principal es gestionar las transacciones, interactuar con la red Stellar y coordinar la salida de fondos con Airtm.

## 🚀 Tecnologías Principales
- **Express**: Framework web para la API.
- **Stellar SDK**: Interacción con la red Stellar (Horizon).
- **PostgreSQL**: Persistencia de datos de transacciones.
- **ts-node-dev**: Entorno de desarrollo para TypeScript.

## 🔄 Flujo de Funcionamiento

1. **Creación de Intención**:
   - Recibe una solicitud desde el frontend con el monto en USD.
   - Crea un registro en la base de datos con estado `PENDING`.
   - Genera (o utiliza) una dirección de depósito Stellar.

2. **Monitoreo de Pagos (Stellar Service)**:
   - Utiliza `Stellar Horizon Streaming` para escuchar pagos en tiempo real hacia la dirección de depósito.
   - Implementa una verificación retroactiva (`checkPastPayments`) para detectar pagos realizados antes de la conexión del stream.
   - Al detectar un pago válido, actualiza el estado a `PAID` y registra el hash de la transacción.

3. **Procesamiento de Salida (Airtm Integration)**:
   - Una vez confirmado el pago en Stellar, se activa el servicio de Airtm.
   - Se genera un voucher simulado (PoC) y se actualiza el estado final de la transacción a `COMPLETED`.

## 📁 Estructura de Archivos Clave
- `src/index.ts`: Punto de entrada y configuración del servidor.
- `src/services/stellar.service.ts`: Lógica de conexión y monitoreo de la blockchain.
- `src/controllers/transaction.controller.ts`: Manejo de peticiones API y lógica de negocio.
- `src/services/airtm-mock.service.ts`: Simulación de la API de Airtm.
