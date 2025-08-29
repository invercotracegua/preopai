#!/usr/bin/env bash
set -e
pushd backend
npx prisma migrate deploy
popd
