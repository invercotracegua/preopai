#!/usr/bin/env bash
set -euo pipefail
STAMP=$(date +%Y%m%d_%H%M%S)
mkdir -p backups
pg_dump -U preopai preopai > backups/db_${STAMP}.sql || true
tar -czf backups/media_${STAMP}.tar.gz backend/uploads || true
echo "[PreopAI] Backup creado en backups/"
