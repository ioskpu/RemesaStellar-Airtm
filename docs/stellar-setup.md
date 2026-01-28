# Guía de Configuración Stellar (Testnet)

Para que el proyecto funcione correctamente, necesitas configurar una cuenta de depósito en la red de pruebas (Testnet) de Stellar. Sigue estos pasos:

## 1. Crear una cuenta en Testnet
1. Ve al [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test).
2. Haz clic en **"Generate keypair"**.
3. **IMPORTANTE**: Guarda tu `Public Key` y `Secret Key` en un lugar seguro.
4. Haz clic en el botón **"Friendbot"** e ingresa tu `Public Key` para cargar la cuenta con XLM de prueba.

## 2. Configurar el Backend
1. Abre el archivo `apps/backend/.env`.
2. Configura las siguientes variables:
   ```env
   STELLAR_NETWORK=testnet
   # Esta es la llave pública donde recibirás los pagos de los usuarios
   STELLAR_DEPOSIT_PUBLIC_KEY=TU_PUBLIC_KEY_GENERADA
   ```

## 3. Entender el flujo de fondos
En este simulador:
- El usuario envía XLM desde su billetera personal (ej. Albedo, Lobster o el mismo Stellar Lab) a la `STELLAR_DEPOSIT_PUBLIC_KEY`.
- El backend detecta este pago mediante el servicio de streaming que apunta a esa cuenta.

## 4. Herramientas de Verificación
Puedes rastrear todas las operaciones en tiempo real usando:
- [Stellar Expert (Testnet)](https://stellar.expert/explorer/testnet/): Ingresa tu llave pública para ver los pagos recibidos.
