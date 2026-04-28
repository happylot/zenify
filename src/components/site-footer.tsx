import Link from "next/link";

const footerGroups = [
  {
    title: "Platform",
    links: [
      { href: "/features/ai-chatbot", label: "AI Chatbot" },
      { href: "/features/ai-voicebot", label: "AI Voicebot" },
      { href: "/features/sales-crm", label: "Sales CRM" },
      { href: "/features/workflow-automation", label: "Automation" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/help", label: "Help Center" },
      { href: "/webinars", label: "Webinars" },
      { href: "/customers/customer-stories", label: "Customer Stories" },
      { href: "/comparison", label: "Comparison" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/enterprise", label: "Enterprise" },
      { href: "/careers", label: "Careers" },
      { href: "/contact", label: "Contact" },
      { href: "/legal/privacy-policy", label: "Privacy Policy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link href="/" className="brand footer-brand">
            <span className="brand-mark">Z</span>
            <span>Zenify</span>
          </Link>
          <p className="footer-copy">
            Zenify.cx is positioned as a leading omnichannel CXM SaaS for businesses of every size,
            covering marketing, sales, service, automation, and AI operations.
          </p>
        </div>
        {footerGroups.map((group) => (
          <div key={group.title}>
            <h3>{group.title}</h3>
            <ul className="footer-links">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container footer-bottom">
        <p>© 2026 Zenify.cx. All rights reserved.</p>
        <p>Landing Page → Trial → Billing → 15-Day Trial → Paid Subscription</p>
      </div>
    </footer>
  );
}
