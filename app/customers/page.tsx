import { PageHero } from "@/components/page-hero";

export default function CustomersPage() {
  return (
    <main>
      <PageHero
        eyebrow="Customers"
        title="Proof that supports conversion"
        description="This section is reserved for logos, customer testimonials, ROI snapshots, and public proof assets."
      />
      <section className="section">
        <div className="container detail-card">
          <h2>Customer proof strategy</h2>
          <ul>
            <li>Hero testimonials and company logos</li>
            <li>Industry-specific case studies</li>
            <li>Trial-to-paid conversion proof</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
