<!--
Luật cho CLAUDE.md của repo (chú thích này bị strip khỏi context, chỉ người sửa file thấy):
- Đây là bộ nhớ quy trình, không phải mô tả repo. Không viết Overview, Tech Stack, Architecture,
  Project Structure, cây thư mục, danh sách module hay số đếm kiểu "40+ controller": `ls`/`grep` ra được.
- Chỉ giữ dòng thuộc một trong sáu mục bên dưới. Giữ đúng sáu heading, không thêm heading khác.
- Thêm dòng mới chỉ sau một lỗi đã lặp lại, không thêm phòng xa. Sửa file thì cắt trước khi nối thêm.
- Giới hạn: ≤ 8 KiB và ≤ 200 dòng. Kiểm bằng `zenify doctor` (check `context-budget`).
- Xóa các chú thích hướng dẫn dưới mỗi heading khi đã điền nội dung.
-->

## Commands

```bash
npm run dev
npm run build          # prebuild xóa cache .next (scripts/clean-next-cache.mjs) rồi next build
npm start              # production, port từ PORT (prod dùng 3001)
npm run typecheck      # next typegen rồi tsc --noEmit
npm run db:generate
npm run db:push
npm run db:seed        # prisma/seed.ts qua tsx
npm run admin:hash -- "password"   # sinh ADMIN_PASSWORD_HASH cho file env
```

Không có test runner và không có lint script.

## Lệnh chậm hoặc nguy hiểm

Chưa có.

## Conventions

- Cần host của request hoặc session thì đi qua helper trong `src/lib/admin-auth.ts` (`isAdminHost`, `isPrimarySiteHost`, `getAdminSession`), không tự parse header `host`.
- Import Prisma client từ `src/lib/db.ts`, không `new PrismaClient()`.
- Đổi route guard hoặc hostname thì sửa `proxy.ts` và `src/lib/admin-auth.ts` cùng lúc; `SITE_HOST` và `ADMIN_HOST` quyết định host.

## Verify

- `npm run typecheck` là cách kiểm kiểu duy nhất.

## Deploy

- Push lên `main` kích hoạt `.github/workflows/deploy.yml`: SSH vào VPS (`14.225.7.175:1786`), pull `/var/www/zenify`, `npm ci`, `next build`, reload pm2 (`ecosystem.config.js`, port 3001 sau nginx).
- Setup lần đầu dùng `scripts/bootstrap-server.sh`; danh sách env và các bước một lần nằm trong `DEPLOYMENT.md`.

## Gotchas

- Next.js 16 dùng `proxy.ts` thay cho `middleware.ts`; `export const config.matcher` vẫn áp dụng.
- `PAYPAL_ENVIRONMENT` chọn sandbox hay live; `app/api/cron/billing` yêu cầu `CRON_SECRET`.
