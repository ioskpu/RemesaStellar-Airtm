# Simulador de Remesa - CryptoRemit Demo

Este proyecto es una prueba de concepto (PoC) de un sistema de remesas moderno que utiliza la red de **Stellar** para facilitar transferencias transfronterizas rápidas y económicas, integrándose finalmente con **Airtm** para la entrega de fondos.

## 🎯 Objetivo del Proyecto

Demostrar un flujo de usuario fluido y profesional (estilo Fintech) para el envío de remesas, donde:
1. El usuario inicia una solicitud de envío en USD.
2. El sistema genera una dirección de depósito única en la red Stellar.
3. El sistema monitorea en tiempo real la red Stellar para detectar el pago en XLM.
4. Una vez confirmado, se procesa la salida de fondos mediante un voucher de Airtm.

---

## ✨ Características Principales

- **UI/UX Premium**: Interfaz refinada con estética Fintech, estados de carga interactivos y diseño responsivo.
- **Sincronización en Tiempo Real**: Uso de *Stellar Horizon Streaming* para detectar pagos instantáneamente sin necesidad de recargar la página.
- **Generación de QR**: Facilita el pago desde billeteras móviles mediante códigos QR dinámicos.
- **Arquitectura Robusta**: Separación clara entre el frontend (Next.js) y el backend (Node.js/Express).
- **Seguridad y Transparencia**: Enlaces directos a exploradores de bloques (Stellar Expert) para verificar cada transacción.

---

## 🛠️ Stack Tecnológico

### Frontend
- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **Iconografía**: [Lucide React](https://lucide.dev/)
- **Componentes**: React QR Code para la generación de pagos.

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express](https://expressjs.com/)
- **Base de Datos**: [PostgreSQL](https://www.postgresql.org/)
- **Blockchain**: [Stellar SDK](https://www.stellar.org/developers/js-stellar-sdk/reference/)

---

## 📂 Estructura del Proyecto

```text
SimuladorRemesa/
├── apps/
│   ├── frontend/     # Aplicación Next.js (Interfaz de usuario)
│   └── backend/      # Servidor Express (Lógica de negocio y monitoreo Stellar)
└── README.md         # Documentación general
```

---

## 📖 Documentación Detallada

Para más detalles sobre el funcionamiento interno y configuración, consulta nuestra documentación:
- **[Índice de Documentación](./docs/index.md)**
- [Guía de Configuración Stellar](./docs/stellar-setup.md)
- [Arquitectura Backend](./docs/backend.md)
- [Arquitectura Frontend](./docs/frontend.md)

---

## 🚀 Instalación y Uso

### Requisitos Previos
- Node.js (v18 o superior)
- **Base de Datos**: Puedes elegir una de estas dos opciones:
  - **Opción A (Recomendada)**: [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado para levantar la base de datos automáticamente.
  - **Opción B**: PostgreSQL instalado localmente (requiere ejecutar el script `database/schema.sql` manualmente).

### Configuración del Backend
1. **Levantar la Base de Datos**:
   - Si usas Docker (Recomendado): Ejecuta `docker-compose up -d` en la raíz del proyecto. Esto creará la base de datos y las tablas automáticamente.
   - Si usas PostgreSQL local: Crea una base de datos llamada `remesa_simulador` y ejecuta el contenido de `database/schema.sql`.

2. **Instalación**:
   - Navega a `apps/backend`.
   - Copia `.env.example` a `.env` y configura tus credenciales. (Si usas Docker, el puerto por defecto en el compose es `5433`).
   - Instala dependencias: `npm install`.
   - Inicia el servidor: `npm run dev`.

### Configuración del Frontend
1. Navega a `apps/frontend`.
2. Instala dependencias: `npm install`.
3. Inicia la aplicación: `npm run dev`.
4. Accede a `http://localhost:3000`.

---

## 📝 Notas de Implementación
- El sistema utiliza la **Testnet** de Stellar para todas las operaciones.
- La integración con Airtm está actualmente simulada (Mock Service) para propósitos de demostración de flujo.
- El monitoreo de Stellar incluye una verificación retroactiva para asegurar que no se pierdan pagos realizados justo antes de la conexión del stream.

---
Desarrollado como una demostración técnica de capacidades Fintech y Web3.
