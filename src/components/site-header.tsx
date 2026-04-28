import Link from "next/link";
import { primaryNav } from "@/lib/site-data";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container nav-shell">
        <Link href="/" className="brand">
          <span className="brand-mark">Z</span>
          <span>Zenify</span>
        </Link>
        <nav className="main-nav">
          {primaryNav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="nav-cta">
          <Link href="/signup" className="text-link">
            Start Trial
          </Link>
          <Link href="/pricing" className="button button-small">
            See Pricing
          </Link>
        </div>
      </div>
    </header>
  );
}
