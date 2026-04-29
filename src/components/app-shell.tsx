import Link from "next/link";
import { ReactNode } from "react";
import { appAreas } from "@/lib/site-data";

export function AppShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="section">
      <div className="container app-layout">
        <aside className="app-sidebar">
          <p className="eyebrow">Application</p>
          <h2>Zenify Admin</h2>
          <nav className="app-nav">
            {appAreas.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <Link href="/admin/logout" className="text-link">
            Sign out
          </Link>
        </aside>
        <div className="app-panel">
          <h1>{title}</h1>
          <p className="lead compact">{description}</p>
          {children}
        </div>
      </div>
    </section>
  );
}
