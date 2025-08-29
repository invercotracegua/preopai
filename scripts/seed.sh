#!/usr/bin/env bash
set -e
pushd backend
npm run seed
popd
