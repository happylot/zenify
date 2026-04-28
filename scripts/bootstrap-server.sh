#!/usr/bin/env bash

set -euo pipefail

APP_DIR="/var/www/zenify"
REPO_URL="${1:-https://github.com/happylot/zenify.git}"
BRANCH="${2:-main}"

apt-get update
apt-get install -y curl git nginx

if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

if ! command -v pm2 >/dev/null 2>&1; then
  npm install -g pm2
fi

mkdir -p "$APP_DIR"

if [ ! -d "$APP_DIR/.git" ]; then
  git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
fi

cd "$APP_DIR"
npm ci
npm run build
npx pm2 startOrReload ecosystem.config.js --update-env
npx pm2 save

cp deploy/nginx/zenify.cx.conf /etc/nginx/sites-available/zenify.cx
ln -sfn /etc/nginx/sites-available/zenify.cx /etc/nginx/sites-enabled/zenify.cx
nginx -t
systemctl reload nginx
