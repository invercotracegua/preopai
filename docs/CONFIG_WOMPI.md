# CONFIG_WOMPI.md

1) Usa las llaves TEST primero (WOMPI_ENV=TEST).
2) Crea un checkout (en producción integrarás los endpoints reales de Wompi).
3) Configura el Webhook:
   - URL: https://TU_DOMINIO/api/billing/webhooks/wompi
   - Valida cabecera de firma (X-Wompi-Signature) con WOMPI_EVENT_SECRET.
4) Marca la transacción como APPROVED y suma al wallet de la empresa (companyId).
5) Conciliación: guarda wompi_id y respuesta completa en `transactions`.
