# Deployment

Zenify deploys to the production VPS with GitHub Actions over SSH.

## Server target

- Host: `14.225.7.175`
- SSH port: `1786`
- App directory: `/var/www/zenify`
- App port: `3001`
- Process manager: `pm2`
- Reverse proxy: `nginx`
- Domain: `zenify.cx`
- Admin domain: `admin.zenify.cx`

## GitHub Actions secrets

Add these repository secrets before enabling auto deploy:

- `VPS_HOST`
- `VPS_PORT`
- `VPS_USER`
- `VPS_PASSWORD`

## Required server env file

Create `/var/www/zenify/.env.local` on the VPS with production values:

```env
NEXT_PUBLIC_PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_ENVIRONMENT=live
PAYPAL_WEBHOOK_ID=
DATABASE_URL=
CRON_SECRET=
SITE_HOST=zenify.cx
ADMIN_HOST=admin.zenify.cx
ADMIN_EMAIL=ops@zenify.cx
ADMIN_PASSWORD_HASH=
ADMIN_SESSION_SECRET=
ADMIN_SESSION_TTL_HOURS=12
PORT=3001
```

Generate the admin password hash locally before you write the env file:

```bash
npm run admin:hash -- "replace-with-a-strong-password"
```

## First-time bootstrap

Run this once on the VPS after the repository is pushed:

```bash
cd /var/www/zenify
```

If the directory does not exist yet, bootstrap from the repo root:

```bash
bash scripts/bootstrap-server.sh https://github.com/happylot/zenify.git main
```

## Ongoing deploys

Every push to `main` triggers `.github/workflows/deploy.yml`, which:

1. Connects to the VPS over SSH.
2. Pulls the latest code into `/var/www/zenify`.
3. Runs `npm ci`.
4. Builds the Next.js app.
5. Reloads `pm2`.

## SSL

After nginx is active and DNS points to `14.225.7.175`, issue the certificate on the VPS:

```bash
certbot --nginx -d zenify.cx -d www.zenify.cx -d admin.zenify.cx
```
