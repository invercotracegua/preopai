#!/usr/bin/env bash
set -euo pipefail

echo "[PreopAI] Instalación iniciada..."

if ! command -v sudo >/dev/null 2>&1; then
  alias sudo=''
fi

# 1) Dependencias del sistema
sudo apt-get update -y
sudo apt-get install -y curl gnupg ca-certificates lsb-release build-essential nginx postgresql postgresql-contrib

# 2) Node.js LTS
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

# 3) PM2
sudo npm i -g pm2

# 4) Config DB
DB_PASS=$(grep -E '^DATABASE_URL=' .env | sed -E 's/.*preopai:([^@]+)@.*/\1/')
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='preopai'" | grep -q 1 || sudo -u postgres psql -c "CREATE USER preopai WITH PASSWORD '${DB_PASS}';"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='preopai'" | grep -q 1 || sudo -u postgres psql -c "CREATE DATABASE preopai OWNER preopai;"

# 5) Backend
pushd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
npm run seed || true
pm2 start dist/server.js --name preopai-backend -- env $(cat ../.env | xargs)
pm2 save
popd

# 6) Nginx (reverse proxy)
sudo tee /etc/nginx/sites-available/preopai.conf >/dev/null <<'NGINX'
server {
  listen 80;
  server_name _;
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
NGINX
sudo ln -sf /etc/nginx/sites-available/preopai.conf /etc/nginx/sites-enabled/preopai.conf
sudo nginx -t && sudo systemctl restart nginx

echo "[PreopAI] Instalación finalizada. Endpoint: http://<IP>/health"
