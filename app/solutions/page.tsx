import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { solutionItems } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Industry Solutions | Zenify CX Platform",
  description:
    "Explore Zenify industry solutions for e-commerce, healthcare, education, SaaS, retail, logistics, hospitality, and enterprise teams that need omnichannel CX, automation, AI chat, and service operations in one platform.",
};

const featuredSolutions = [
  {
    slug: "ecommerce",
    label: "E-commerce customer experience platform",
    title: "E-commerce teams need support, conversion, and retention to run on one operating layer.",
    image:
      "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1400&q=80",
    alt: "Abstract flowing teal light forms representing digital commerce journeys.",
    paragraphs: [
      "Zenify for e-commerce is designed for brands that cannot afford a broken handoff between marketing traffic, pre-sale questions, order support, and post-purchase retention. When stores scale, customer conversations multiply across website chat, social inboxes, email, and service queues. Teams often respond with more disconnected tools, which slows replies, weakens context, and makes it difficult to connect support effort to revenue outcomes. A stronger approach is to run acquisition, service, and lifecycle communication from one platform so the team sees the same customer story at every stage.",
      "On the acquisition side, Zenify helps online stores qualify visitors, answer product questions, recover abandoned carts, and guide high-intent buyers toward conversion. On the service side, it reduces repetitive contact with automation for order status, delivery questions, returns, refund policies, and warranty workflows. After the purchase, the same system can trigger follow-up journeys for loyalty, reactivation, and review collection. This matters because the highest-performing e-commerce support teams are no longer only cost centers. They are a direct contributor to conversion rate, average order value, repeat purchase rate, and long-term retention.",
      "For operators, the value is not only faster response time. It is the ability to connect conversations with order intelligence, route exceptions to the right teams, and prioritize customers based on urgency or account value. That allows brands to move from reactive support toward a more proactive customer experience model.",
    ],
    bullets: [
      "Pre-sale product assistance and conversion support",
      "Order status, returns, refund, and delivery automation",
      "Post-purchase retention, loyalty, and repeat-order journeys",
    ],
  },
  {
    slug: "healthcare",
    label: "Healthcare communication software",
    title: "Healthcare organizations need secure, responsive communication without forcing patients through fragmented channels.",
    image:
      "https://images.unsplash.com/photo-1511300636408-a63a89df3482?auto=format&fit=crop&w=1400&q=80",
    alt: "Abstract layered blue and green waves suggesting calm, structured healthcare communication.",
    paragraphs: [
      "Healthcare communication breaks down when appointment requests, service-desk questions, follow-up reminders, and urgent inbound calls are spread across isolated systems. Patients feel the friction first: slower answers, repeated information, unclear routing, and poor continuity between departments. Zenify gives healthcare teams a more controlled way to manage these touchpoints through structured omnichannel flows, AI-assisted triage, and operational visibility around service quality.",
      "The immediate use cases are practical. Clinics and care networks can automate appointment intake, after-hours call capture, basic FAQ handling, and routing for non-clinical requests. Front-desk teams get relief from repetitive questions while still keeping escalation paths open for sensitive issues. The platform also helps standardize service expectations across locations, specialties, or shift changes, which is especially valuable when inbound demand is uneven during the day. Instead of relying only on manual switching between phones, email, and messaging apps, teams can work from a system that preserves context and assigns clear ownership.",
      "Just as important, healthcare operators need communication tools that respect privacy-aware operating models. Zenify supports structured workflows, access control, and measurable service processes so leaders can improve patient responsiveness without losing control over how information is handled.",
    ],
    bullets: [
      "Appointment scheduling, reminders, and intake routing",
      "After-hours call handling and patient inquiry deflection",
      "Service consistency across departments, locations, and shifts",
    ],
  },
  {
    slug: "education",
    label: "Education and admissions support platform",
    title: "Education teams need faster answers for applicants and students without adding administrative overload.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80",
    alt: "Abstract network of luminous lines evoking learning pathways and information flow.",
    paragraphs: [
      "Educational institutions face a recurring pattern: inquiry volume spikes at exactly the moments when staff capacity is already tight. Admissions cycles, enrollment windows, orientation periods, tuition deadlines, and student services all create waves of repeated questions. When these interactions are managed through inboxes and phone trees with little automation, response times drop and staff spend too much time repeating the same information. Zenify helps schools, colleges, training centers, and education brands build a more responsive communication model that remains manageable at scale.",
      "For admissions and recruitment, Zenify can capture and qualify inquiries, guide prospects to the correct program information, and route high-intent candidates to the right team quickly. For student services, it can surface answers for frequently asked questions, organize support queues, and preserve conversation history so students do not have to start over with every handoff. This reduces friction while giving departments clearer ownership of incoming demand. It also helps institutions present a more modern, reliable experience to prospective students and families who expect digital responsiveness.",
      "The broader advantage is operational clarity. Education organizations often have strong information, but weak distribution. Zenify bridges that gap by making knowledge easier to deliver, measure, and improve. The result is not only faster support, but a communication layer that better supports enrollment growth, student satisfaction, and cross-department coordination.",
    ],
    bullets: [
      "Admissions response automation and inquiry qualification",
      "Student services support across web, email, and messaging",
      "Cross-department knowledge delivery with measurable service quality",
    ],
  },
  {
    slug: "saas",
    label: "SaaS onboarding and customer success platform",
    title: "SaaS companies grow faster when onboarding, support, and expansion signals live in one customer lifecycle system.",
    image:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=1400&q=80",
    alt: "Abstract digital gradient with floating geometric light shapes suggesting software systems and product growth.",
    paragraphs: [
      "Many SaaS teams still operate with a split between product-led growth, customer support, and customer success. The result is familiar: trial users fail to activate, support conversations miss expansion opportunities, and success teams inherit accounts without a full picture of what happened during onboarding. Zenify is built for this exact gap. It brings together signup intelligence, onboarding touchpoints, service interactions, and lifecycle automation so revenue teams can see where a customer is getting stuck and intervene earlier.",
      "For self-serve and mid-market SaaS businesses, the value starts at the top of the funnel. New trials can be guided through activation with contextual messaging, bot-assisted help, and human support escalation when needed. Once customers are active, service teams can continue working from a unified history that includes plan context, workspace milestones, and product issues. That means the same platform can support onboarding, support, renewal preparation, and upgrade prompts rather than treating each phase as a separate workflow.",
      "This approach matters because SaaS growth depends on more than ticket deflection. It depends on activation rate, time to value, retention, expansion, and the ability to spot risk before churn becomes irreversible. Zenify gives SaaS operators a cleaner system for doing that with less fragmentation and more operational accountability.",
    ],
    bullets: [
      "Trial activation support and onboarding orchestration",
      "Unified support and customer success lifecycle visibility",
      "Renewal, upgrade, and expansion automation tied to real usage signals",
    ],
  },
  {
    slug: "retail",
    label: "Retail omnichannel service software",
    title: "Retail brands need store, online, and loyalty conversations to feel like one experience to the customer.",
    image:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1400&q=80",
    alt: "Abstract warm and cool gradients blending like connected retail channels.",
    paragraphs: [
      "Retail customer experience becomes inconsistent when store teams, e-commerce teams, and support teams each use separate communication habits. Customers do not think in channels. They expect the brand to recognize them whether they ask about inventory online, message after a store visit, or contact support after delivery. Zenify helps retail teams build that continuity by centralizing conversations, linking service actions with commercial context, and making it easier to route issues based on intent rather than channel alone.",
      "This is especially useful during promotions, launches, and seasonal spikes when inquiry volume rises and response quality often drops. Store operations can use the platform for assisted selling, appointment-style consultations, clienteling, or local service requests. Central support teams can manage delivery issues, returns, loyalty questions, and escalation workflows with better visibility. Marketing and CX leaders also gain a clearer view of how promotions drive service demand, which helps refine campaigns and staffing decisions instead of treating customer support as a separate operational afterthought.",
      "Retail brands that win on experience are usually the ones that remove friction between discovery, purchase, and post-purchase service. Zenify supports that model by treating every conversation as part of the same brand relationship.",
    ],
    bullets: [
      "Connected store, digital, and post-purchase support flows",
      "Promotion and seasonal spike handling with smarter routing",
      "Loyalty, clienteling, and assisted-selling support journeys",
    ],
  },
  {
    slug: "logistics",
    label: "Logistics and shipment support software",
    title: "Logistics teams need structured exception handling when shipment volume turns status questions into operational drag.",
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1400&q=80",
    alt: "Abstract directional light trails implying movement, routing, and operational flow.",
    paragraphs: [
      "Logistics and delivery businesses deal with a support profile that is unusually repetitive and time-sensitive. Shipment status requests, delay explanations, failed-delivery updates, and account escalation issues can consume large amounts of team capacity if they are handled manually. Zenify helps logistics operators reduce that load by automating common updates, routing exceptions with SLA discipline, and making account communication easier to manage across multiple channels.",
      "The operational payoff is significant. Customers and business accounts get faster answers for standard questions, while human teams can focus on the cases that truly need intervention. Internal coordination also improves because exception handling no longer lives only in ad hoc inboxes or chat threads. Teams can set rules for urgency, account type, service level, or route impact, then measure how quickly issues move to resolution. This gives operators better control over service quality during peak periods, regional disruptions, or high-volume events.",
      "For logistics brands, customer experience is inseparable from reliability. A strong communication layer cannot remove every delay, but it can reduce uncertainty, preserve trust, and keep service operations from collapsing under repetitive contact volume.",
    ],
    bullets: [
      "Shipment status automation and repetitive inquiry deflection",
      "Delay, exception, and account escalation routing with SLA control",
      "Higher service visibility during peaks, disruptions, and operational events",
    ],
  },
];

const buyingReasons = [
  {
    title: "One platform across the customer lifecycle",
    text: "Zenify connects acquisition, onboarding, support, retention, and upgrade workflows so teams stop losing context between tools.",
  },
  {
    title: "Automation without losing service control",
    text: "AI and workflow automation reduce repetitive work while preserving human escalation paths, ownership, and measurable quality standards.",
  },
  {
    title: "Industry-specific flexibility",
    text: "Different sectors need different routing logic, compliance models, and customer journeys. Zenify is structured to adapt without becoming fragmented.",
  },
];

const faqItems = [
  {
    question: "What industries is Zenify best suited for?",
    answer:
      "Zenify is a strong fit for e-commerce, healthcare, education, SaaS, retail, logistics, hospitality, financial services, and multi-team enterprise environments where customer communication directly affects growth, service quality, or operational efficiency.",
  },
  {
    question: "Can Zenify support both sales and customer service workflows?",
    answer:
      "Yes. The platform is built around the full customer lifecycle, so teams can use it for lead capture, assisted conversion, onboarding, support, retention, and expansion instead of forcing those workflows into separate systems.",
  },
  {
    question: "Does Zenify replace every existing business system?",
    answer:
      "No. In many deployments Zenify acts as the communication and workflow layer that connects with CRM, billing, commerce, or internal systems. The goal is to unify customer operations, not create unnecessary platform sprawl.",
  },
  {
    question: "Why create industry solution pages instead of one generic platform page?",
    answer:
      "Because buyers search for sector-specific needs. A healthcare operator evaluating patient communication tools has different priorities than a SaaS team managing trial activation. Industry pages make those needs explicit and improve both relevance and search visibility.",
  },
];

export default function SolutionsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Solutions"
        title="Industry solutions for teams that need customer communication, automation, and service operations to work together"
        description="Zenify is a customer experience platform for businesses that need omnichannel conversations, AI automation, ticketing, CRM context, and lifecycle workflows adapted to the way each industry actually operates."
      />

      <section className="section section-tight">
        <div className="container detail-card prose-block">
          <p>
            The best customer experience software is not the one with the longest feature list. It is the one that
            fits the operating reality of the business using it. An e-commerce brand needs fast answers tied to order
            and retention workflows. A healthcare organization needs structured communication with privacy-aware
            processes. A SaaS company needs onboarding, support, and expansion signals in one lifecycle view. That is
            why Zenify organizes its platform around industry solutions rather than generic feature claims alone.
          </p>
          <p>
            This page is designed for teams searching for customer service software, omnichannel support tools, AI
            chatbot platforms, workflow automation systems, or CX operations software with a more practical industry
            lens. The goal is simple: show how Zenify helps different business models run acquisition, service, and
            retention more coherently. Each solution below highlights where communication usually breaks down, what a
            stronger operating model looks like, and how Zenify supports that shift.
          </p>
        </div>
      </section>

      <section className="section section-tight tint">
        <div className="container three-col-grid">
          {buyingReasons.map((item) => (
            <article key={item.title} className="detail-card">
              <h2>{item.title}</h2>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container section-heading center">
          <p className="eyebrow">Featured industries</p>
          <h2>Solutions built around real service pressure, not generic platform language</h2>
          <p>
            These six sectors represent common high-value use cases where fragmented communication usually creates
            measurable revenue loss, service delays, or operational inefficiency.
          </p>
        </div>
        <div className="container solution-editorial-stack">
          {featuredSolutions.map((item, index) => (
            <article
              key={item.slug}
              className={`detail-card solution-spotlight ${index % 2 === 1 ? "solution-spotlight-reverse" : ""}`}
            >
              <div className="solution-visual">
                <Image src={item.image} alt={item.alt} fill sizes="(max-width: 900px) 100vw, 40vw" />
              </div>
              <div className="solution-copy">
                <p className="eyebrow">{item.label}</p>
                <h2>{item.title}</h2>
                {item.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                <ul className="solution-bullets">
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                <Link href={`/solutions/${item.slug}`} className="card-link">
                  Explore this solution
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section tint">
        <div className="container section-heading center">
          <p className="eyebrow">More industries</p>
          <h2>Browse all Zenify solution pages</h2>
          <p>
            Every solution page connects industry pain points with recommended modules, expected outcomes, and the next
            logical conversion path into signup, demo, or pricing.
          </p>
        </div>
        <div className="container">
          <div className="card-grid">
            {solutionItems.map((item) => (
              <article key={item.slug} className="card">
                <p className="solution-tag">{item.title.replace("Zenify for ", "")}</p>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <Link href={`/solutions/${item.slug}`} className="card-link">
                  View industry page
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container detail-card">
          <div className="section-heading">
            <p className="eyebrow">FAQ</p>
            <h2>Common questions about Zenify solutions</h2>
          </div>
          <div className="faq-grid">
            {faqItems.map((item) => (
              <article key={item.question} className="faq-item">
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tight cta-section">
        <div className="container detail-card">
          <div className="cta-strip">
            <div>
              <p className="eyebrow">Next step</p>
              <h2>Choose an industry path, then route the buyer into trial, pricing, or an implementation conversation.</h2>
            </div>
            <div className="cta-strip-actions">
              <Link href="/signup" className="button">
                Start free trial
              </Link>
              <Link href="/contact" className="text-link">
                Request industry demo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
