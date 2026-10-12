<!--
Rules for a repo's CLAUDE.md (this comment is stripped from the context; only the person editing the file sees it):
- This is procedural memory, not a description of the repo. No Overview, Tech Stack, Architecture,
  Project Structure, directory tree, module list or counts like "40+ controllers": `ls`/`grep` gives those.
- Keep only lines that belong to one of the six sections below. Keep exactly these six headings; add no other.
- Add a line only after a mistake has repeated, never speculatively. When editing, cut before appending.
- Limits: ≤ 8 KiB and ≤ 200 lines. Check with `zenify doctor` (check `context-budget`).
- Delete the guidance comments under each heading once the section is filled.
-->

## Commands

```bash
npm run dev
npm run build          # prebuild deletes the .next cache (scripts/clean-next-cache.mjs) then runs next build
npm start              # production, port from PORT (prod uses 3001)
npm run typecheck      # next typegen then tsc --noEmit
npm run db:generate
npm run db:push
npm run db:seed        # prisma/seed.ts via tsx
npm run admin:hash -- "password"   # generates ADMIN_PASSWORD_HASH for the env file
```

There is no test runner and no lint script.

## Slow or dangerous commands

None yet.

## Conventions

- When you need the request host or the session, go through the helpers in `src/lib/admin-auth.ts` (`isAdminHost`, `isPrimarySiteHost`, `getAdminSession`); do not parse the `host` header yourself.
- Import the Prisma client from `src/lib/db.ts`, never `new PrismaClient()`.
- When changing the route guard or hostnames, edit `proxy.ts` and `src/lib/admin-auth.ts` together; `SITE_HOST` and `ADMIN_HOST` decide the host.

## Verify

- `npm run typecheck` is the only type check.

## Deploy

- A push to `main` triggers `.github/workflows/deploy.yml`: SSH into the VPS (`14.225.7.175:1786`), pull `/var/www/zenify`, `npm ci`, `next build`, reload pm2 (`ecosystem.config.js`, port 3001 behind nginx).
- First-time setup uses `scripts/bootstrap-server.sh`; the env list and one-time steps are in `DEPLOYMENT.md`.

## Gotchas

- Next.js 16 uses `proxy.ts` in place of `middleware.ts`; `export const config.matcher` still applies.
- `PAYPAL_ENVIRONMENT` selects sandbox or live; `app/api/cron/billing` requires `CRON_SECRET`.
