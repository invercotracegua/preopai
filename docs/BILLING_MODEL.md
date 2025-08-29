# BILLING_MODEL.md

- Wallet por empresa
- Precio por revisión (GLOBAL empresa) con override por vehículo
- Transacciones: TOPUP (recarga), DEBIT (revisión), REFUND
- Webhook idempotente (verificar firma y evitar duplicados)
- Alertas por umbral bajo (minThreshold)
