import Link from "next/link";
import type { ReactNode } from "react";
import { HeroHeadline } from "@/components/hero-headline";

function FeatureIcon({ children }: { children: ReactNode }) {
  return (
    <span className="feature-icon" aria-hidden="true">
      <svg viewBox="0 0 48 48" fill="none" role="presentation">
        {children}
      </svg>
    </span>
  );
}

export default function HomePage() {
  const aiCxFeatures = [
    {
      title: "Omnichannel Inbox",
      copy: "Bring Facebook, Zalo, WhatsApp, VoIP, and more into one unified workspace.",
      icon: (
        <>
          <rect x="8" y="12" width="32" height="22" rx="9" stroke="currentColor" strokeWidth="2.4" />
          <path d="M16 20h16M16 26h10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M20 34l-5 5v-5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ),
    },
    {
      title: "Ticketing & SLA Management",
      copy: "Route requests intelligently and manage response and resolution targets automatically.",
      icon: (
        <>
          <path d="M14 15.5h20a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H14a3 3 0 0 1-3-3v-11a3 3 0 0 1 3-3Z" stroke="currentColor" strokeWidth="2.4" />
          <path d="M19 15.5v-2a5 5 0 0 1 10 0v2" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M24 20v5l3 2" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ),
    },
    {
      title: "Sales CRM",
      copy: "Track deals, tasks, and pipelines from prospecting to conversion with one shared record.",
      icon: (
        <>
          <path d="M12 31c2.5-7 9.7-12 17.5-12 2.4 0 4.7.5 6.7 1.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="17" cy="18" r="4.5" stroke="currentColor" strokeWidth="2.4" />
          <circle cx="31" cy="28" r="7" stroke="currentColor" strokeWidth="2.4" />
          <path d="m31 24 1.7 3.2L36 29" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ),
    },
    {
      title: "Workflow Automation",
      copy: "Design complex workflows with a drag-and-drop interface without writing code.",
      icon: (
        <>
          <rect x="10" y="10" width="10" height="10" rx="3" stroke="currentColor" strokeWidth="2.4" />
          <rect x="28" y="10" width="10" height="10" rx="3" stroke="currentColor" strokeWidth="2.4" />
          <rect x="19" y="28" width="10" height="10" rx="3" stroke="currentColor" strokeWidth="2.4" />
          <path d="M20 15h8M24 20v8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </>
      ),
    },
    {
      title: "AI Chatbot",
      copy: "Respond with context, learn from every conversation, and improve customer support over time.",
      icon: (
        <>
          <path d="M12 17a8 8 0 0 1 8-8h8a8 8 0 0 1 8 8v8a8 8 0 0 1-8 8h-9l-7 6v-9a8 8 0 0 1-3-6v-7Z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
          <circle cx="20" cy="21" r="1.5" fill="currentColor" />
          <circle cx="28" cy="21" r="1.5" fill="currentColor" />
          <path d="M19.5 27c1.3 1.3 3 2 4.5 2s3.2-.7 4.5-2" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </>
      ),
    },
    {
      title: "AI Voicebot",
      copy: "Handle inbound and outbound calls with natural voice interactions and speech recognition.",
      icon: (
        <>
          <path d="M24 11v12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          <rect x="19" y="8" width="10" height="18" rx="5" stroke="currentColor" strokeWidth="2.4" />
          <path d="M15 23a9 9 0 0 0 18 0M24 32v6M19 38h10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </>
      ),
    },
    {
      title: "Smart QA System",
      copy: "Score service quality against CX standards and generate precise feedback for improvement.",
      icon: (
        <>
          <path d="M24 10 34 14v8c0 7-4.4 13.2-10 15-5.6-1.8-10-8-10-15v-8l10-4Z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
          <path d="m19.5 24 3 3 6-7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ),
    },
    {
      title: "AI Agent Coaching",
      copy: "Use MBTI and DISC-informed coaching to elevate each agent with tailored recommendations.",
      icon: (
        <>
          <circle cx="18" cy="18" r="5" stroke="currentColor" strokeWidth="2.4" />
          <circle cx="31" cy="16" r="4" stroke="currentColor" strokeWidth="2.4" />
          <path d="M10 34c1.8-5.2 6.4-8 11-8s9.2 2.8 11 8M28 33c.8-2.7 2.8-4.7 5.5-5.7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </>
      ),
    },
    {
      title: "Real-time Insight Dashboards",
      copy: "Monitor KPIs, uncover trends, and act quickly with live CX analytics and alerts.",
      icon: (
        <>
          <path d="M12 34h24" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M16 30V22M24 30V16M32 30v-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          <path d="m15 18 7-6 5 4 7-7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ),
    },
  ];

  return (
    <main>
      <section className="hero">
        <div className="hero-media" />
        <div className="hero-overlay" />
        <div className="container hero-content">
          <p className="eyebrow">AI Customer Experience Platform</p>
          <HeroHeadline />
          <p className="hero-copy">
            Zenify brings together omnichannel communication, intelligent CRM, workflow automation,
            and AI coaching to help businesses deliver customer experiences with speed, clarity, and
            measurable happiness.
          </p>
          <div className="hero-actions">
            <Link href="/contact" className="button">
              Schedule a Demo
            </Link>
            <Link href="/pricing" className="button button-ghost">
              View Pricing
            </Link>
            <Link href="/features" className="button button-ghost">
              Explore Features
            </Link>
          </div>
          <div className="hero-points">
            <span>Deploy in 24 hours</span>
            <span>24/7 support</span>
            <span>15-day free trial</span>
          </div>
        </div>
      </section>

      <section className="stats-wrap">
        <div className="container">
          <div className="stats-banner">
            <div>
              <strong>Built for modern service teams</strong>
              <p>One platform for marketing, sales, and support collaboration.</p>
            </div>
            <div className="stats-grid">
              <article>
                <h2>300+</h2>
                <p>Customers</p>
              </article>
              <article>
                <h2>1,000+</h2>
                <p>Agents</p>
              </article>
              <article>
                <h2>10M+</h2>
                <p>Voice minutes</p>
              </article>
              <article>
                <h2>50M+</h2>
                <p>Conversations</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-story">
        <div className="container split">
          <div className="photo-card" />
          <div className="section-copy">
            <p className="eyebrow">Customer Journey</p>
            <h2>One connected workflow from first touch to long-term loyalty</h2>
            <p>
              Zenify helps teams orchestrate customer experience across marketing, sales, and
              helpdesk in a single collaborative system. Every team works from the same real-time
              customer context.
            </p>
            <div className="journey-columns">
              <article>
                <h3>Marketing</h3>
                <p>Attract and nurture leads through social, email, web, content, lead scoring, and campaign analytics.</p>
              </article>
              <article>
                <h3>Sales</h3>
                <p>Qualify opportunities, manage calls and proposals, and monitor pipelines with full customer profiles.</p>
              </article>
              <article>
                <h3>Helpdesk</h3>
                <p>Resolve issues with chat, tickets, knowledge base, feedback loops, and support quality analytics.</p>
              </article>
            </div>
            <div className="info-chip">
              <strong>Unified Data Hub</strong>
              <span>All customer data syncs in real time to create a complete 360° customer view.</span>
              <small>Real-time Sync · Data Security · 360° Analytics</small>
            </div>
          </div>
        </div>
      </section>

      <section className="section features-section">
        <div className="container">
          <div className="section-heading center">
            <p className="eyebrow">Complete AI-CX Features</p>
            <h2>Everything a modern customer team needs in one platform</h2>
            <p>
              Zenify combines communication, CRM, automation, and AI operations into a cohesive
              system built for enterprise-grade customer experience.
            </p>
          </div>
          <div className="feature-grid">
            {aiCxFeatures.map(({ title, copy, icon }) => (
              <article key={title} className="feature-card">
                <FeatureIcon>{icon}</FeatureIcon>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading center">
            <p className="eyebrow">Why Zenify</p>
            <h2>The AI-CX advantage behind better customer relationships</h2>
          </div>
          <div className="value-grid">
            {[
              ["Understanding Customers", "AI analyzes intent, sentiment, and behavior deeply enough to reveal real needs and predict future trends."],
              ["Smart Conversations", "Chatbot and voicebot systems become smarter after every interaction and steadily improve conversion rates."],
              ["AI-Powered Coaching", "Agents receive individualized coaching based on communication styles and personality frameworks."],
              ["Insightful Dashboards", "Visualize NPS, customer journeys, and CX alerts clearly enough to make timely operating decisions."],
            ].map(([title, copy]) => (
              <article key={title} className="value-card">
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section solutions-section">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Solutions by Industry</p>
            <h2>Built to match the realities of each business sector</h2>
          </div>
          <div className="solutions-grid">
            {[
              ["E-commerce", "Optimize shopping journeys with AI recommendations, 24/7 support bots, and behavioral insights."],
              ["Healthcare", "Support intake, patient record management, and intelligent health consultations with secure automation."],
              ["Education", "Personalize learning experiences, automate evaluation, and support instructors with AI assistance."],
              ["Enterprise", "Automate internal workflows, streamline people operations, and improve organizational productivity."],
            ].map(([title, copy]) => (
              <article key={title} className="solution-card">
                <span className="solution-tag">{title}</span>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section testimonials-section">
        <div className="container">
          <div className="section-heading center">
            <p className="eyebrow">Customer Voices</p>
            <h2>What businesses say about working with Zenify</h2>
            <p>More than 300 companies trust Zenify to transform customer experience at scale.</p>
          </div>
          <div className="testimonial-grid">
            {[
              ["Zenify helped us increase customer service productivity by 300%. The AI chatbot is powerful, easy to use, and our customers are noticeably happier.", "Nguyen Minh", "CEO, Soft Dreams"],
              ["Zenify’s analytics capabilities are extremely strong. We can make faster and more accurate business decisions because the data is finally actionable.", "Le Huong", "CMO, Oh Vacation"],
              ["Implementation took only two days, yet the impact surpassed expectations. We reached 400% ROI in just three months.", "Tran Khang", "CTO, Global Travel"],
            ].map(([quote, name, role]) => (
              <article key={name} className="testimonial-card">
                <p>{quote}</p>
                <strong>{name}</strong>
                <span>{role}</span>
              </article>
            ))}
          </div>
          <blockquote className="quote-card">
            <p>
              “AI will not replace people in customer experience, but people who know how to use AI
              will replace those who do not.”
            </p>
            <footer>Satya Nadella, CEO of Microsoft · Leader in AI and Cloud Computing</footer>
          </blockquote>
        </div>
      </section>

      <section className="section cta-section">
        <div className="container cta-panel">
          <div>
            <p className="eyebrow">Ready to Start?</p>
            <h2>Join the companies choosing Zenify to grow faster with better CX</h2>
          </div>
          <div className="cta-panel-actions">
            <Link href="/signup" className="button">
              Start Free Trial
            </Link>
            <Link href="/pricing" className="text-link text-link-light">
              Explore pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
