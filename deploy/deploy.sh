#!/bin/bash
# Run on the VPS as user "bbn" (invoked by GitHub Actions over SSH).
set -euo pipefail
source "$HOME/.nvm/nvm.sh"

APP_DIR="${APP_DIR:-/var/www/Bharat-BN}"
cd "$APP_DIR"
git fetch origin main
git reset --hard origin/main

# Build one app at a time, at low priority, so the other site on this VPS is not starved.
export NODE_OPTIONS="--max-old-space-size=1536"
nice -n 19 npm install
nice -n 19 npm run build --prefix backend
nice -n 19 npm run build --prefix frontend
nice -n 19 npm run build --prefix admin

pm2 startOrReload ecosystem.config.js --update-env
pm2 save
echo "Deploy finished: $(git rev-parse --short HEAD)"
