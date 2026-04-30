import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{`
        body > header.site-header,
        body > footer.site-footer {
          display: none !important;
        }

        body {
          background:
            radial-gradient(circle at top left, rgba(113, 219, 214, 0.18), transparent 28%),
            linear-gradient(180deg, #f7fbfb 0%, #ecf5f6 100%);
        }
      `}</style>
      {children}
    </>
  );
}
