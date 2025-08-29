#!/usr/bin/env bash
set -euo pipefail
# Crea un proyecto Flutter base y copia las pantallas de este template.
APP_DIR="mobile_app/preopai_app"
if [ ! -d "$APP_DIR" ]; then
  echo "==> Creando esqueleto Flutter (requiere Flutter instalado en el VPS/local)"
  flutter create preopai_app --project-name preopai_app --platforms=android,web
  mv preopai_app mobile_app/
fi
cp -R mobile_app/templates/lib/* mobile_app/preopai_app/lib/
cp mobile_app/templates/pubspec.yaml mobile_app/preopai_app/pubspec.yaml
echo "Listo. Ejecuta: cd mobile_app/preopai_app && flutter run -d chrome"
