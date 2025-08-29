#!/usr/bin/env bash
set -e
pm2 restart preopai-backend || pm2 start backend/dist/server.js --name preopai-backend -- env $(cat .env | xargs)
pm2 save
