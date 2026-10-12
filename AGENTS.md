# AGENTS.md — zenify

## 1. Đọc `./CLAUDE.md` trước

Trước khi đọc hay sửa code trong repo này, đọc `./CLAUDE.md` của repo: lệnh build/test, lệnh chậm hoặc nguy hiểm, convention, cách verify, deploy, gotcha. Repo `zenify-kit` không có `CLAUDE.md`: đọc `./ARCHITECTURE.md` thay thế.

## 2. Đọc tài liệu cấp workspace

Codex không tự nạp file của thư mục cha nằm ngoài git root, nên phải đọc bằng tay.

- Workspace là thư mục cha gần nhất có thư mục con `repos/`. Từ main checkout (`repos/zenify`) là `../../`; từ worktree (`repos/zenify/.worktrees/` + slug) là `../../../../`. Kiểm bằng `ls` trước khi đọc, không đoán.
- Tại workspace, đọc theo thứ tự:
  1. `CLAUDE.md` — bảng routing repo, hạ tầng dùng chung, quy ước git và worktree.
  2. `.claude/rules/00-constitution.md` — luôn áp dụng.
  3. Mỗi rule trong `.claude/rules/` có front-matter `paths:` khớp file đang chạm.
  4. `.claude/memory/MEMORY.md` — index; mở file memory khớp với việc đang làm.

## 3. Ghi chú khi chạy trên Codex

- Gọi skill của kit bằng tiền tố `$znf:` cộng tên skill, ví dụ `$znf:fix`, `$znf:ship`. Đối số là phần chữ đứng sau tên skill trong cùng tin nhắn; Codex không có `$ARGUMENTS`.
- Subagent được tạo bằng tool subagent của Codex, với các agent cùng tên như kit: `scout`, `code-reviewer`, `ui-verifier`, `researcher`, `architect`.
- Thiếu hụt chấp nhận so với Claude Code:
  - Không có hook read-guard: tự đọc file trước khi sửa, không sửa file chưa đọc trong phiên.
  - Không có Workflow tool: bước nào của skill cần Workflow thì làm tuần tự, hoặc chia cho subagent.

## Code Review Rules

- Không fabricate: mọi tên file, hàm, field, collection, endpoint phải đã đọc trong phiên; khẳng định không hiển nhiên phải trích `file:dòng`.
- Không đổi hợp đồng dùng chung (collection Mongo, bảng MySQL, kênh Redis, payload BullMQ, HTTP giữa service) khi chưa sweep đủ 8 repo liệt kê trong `CLAUDE.md` workspace.
- Không merge PR, kể cả PR do agent mở; merge là quyết định deploy của người dùng.
- Chỉ báo finding mức P0/P1, mỗi finding kèm `file:dòng`; không báo góp ý phong cách.
