# PASO A PASO — PreopAI v0.1 (Multiempresa)

**Fecha:** 2025-08-28

## Punto 0 — Prerrequisitos
- VPS Ubuntu 22.04 con acceso root
- Dominio (opcional por ahora; HTTPS con Traefik lo veremos después)
- Flutter instalado (local o VPS) si vas a compilar la App PWA/Android
- Claves Wompi TEST (luego PRO): `WOMPI_PUBLIC_KEY`, `WOMPI_PRIVATE_KEY`, `WOMPI_EVENT_SECRET`

## 1) Subir el ZIP
1. Copia `preopai_v0.1_multi_tenant.zip` al VPS (ej. `/opt/`).
2. `cd /opt && unzip preopai_v0.1_multi_tenant.zip && cd preopai_v0_1`

## 2) Configurar .env
1. `cp backend/.env.example .env`
2. Edita `DATABASE_URL` (pon la contraseña real), `JWT_SECRET` y el admin.
3. Ajusta `PRICE_PER_REVIEW` y `MIN_BALANCE_THRESHOLD` por defecto.

## 3) Instalar
`bash scripts/install.sh`  
Esto instalará Node, PostgreSQL, migrará Prisma, creará admin, y levantará el backend con PM2 y Nginx.

- Verifica salud: `curl http://IP/health`

## 4) Crear empresas y vehículos
- Login: `POST /api/auth/login` con admin.
- Crear empresa: `POST /api/companies` (nombre).
- Crear vehículo: `POST /api/vehicles` con `x-company-id` de la empresa.

## 5) Configurar precios por empresa/vehículo
- (Próx. endpoint) o directo en DB: tabla `PriceConfig`:
  - `forType='GLOBAL'` para precio por empresa.
  - `forType='VEHICLE'` para override por vehículo.

## 6) Recargas (Wompi)
- Crear checkout: `POST /api/billing/topups/create` (placeholder).
- Configurar webhook: `POST /api/billing/webhooks/wompi` (ver `docs/CONFIG_WOMPI.md`).

## 7) Registrar revisión (cobra automáticamente)
- `POST /api/reviews` con `vehicleId`, `driverId` y `x-company-id`.
- Si no hay saldo suficiente => error 402 con saldo y precio.

## 8) Subir evidencias (IA básico)
- `POST /api/media/upload` con `image` (Multer). Devuelve `qualityReport` (resolución mínima).

## 9) App (Flutter / PWA)
- Ejecuta `bash scripts/init_flutter.sh` (requiere `flutter`).
- `cd mobile_app/preopai_app && flutter run -d chrome` (PWA dev).

## 10) Backups
- `bash scripts/backup.sh` (puedes programarlo cada 30 días con cron).

## Evidencia sugerida por paso
- Captura: `curl /health`
- JSON de `POST /auth/login` (sin token completo)
- Empresa creada, vehículo creado (`GET /vehicles`)
- Saldo antes/después de `webhooks/wompi`
- Respuesta de `POST /reviews` (cobro)
- Respuesta de `POST /media/upload` (quality)
