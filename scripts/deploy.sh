#!/usr/bin/env bash

set -euo pipefail

APP_DIR="/var/www/zenify"
BRANCH="${1:-main}"

mkdir -p "$APP_DIR"
cd "$APP_DIR"

if [ ! -d .git ]; then
  echo "Repository has not been cloned on the server yet."
  exit 1
fi

git fetch origin
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"
npm ci
npm run build
npx pm2 startOrReload ecosystem.config.js --update-env
npx pm2 save
