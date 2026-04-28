export type FeatureItem = {
  slug: string;
  title: string;
  summary: string;
  bullets: string[];
};

export type SolutionItem = {
  slug: string;
  title: string;
  summary: string;
  bullets: string[];
  challenges: string[];
  outcomes: string[];
  modules: string[];
};

export type ComparisonItem = {
  slug: string;
  title: string;
  competitor: string;
  summary: string;
  strengths: string[];
  zenifyAdvantages: string[];
  buyerTriggers: string[];
  comparisonRows: Array<{
    label: string;
    zenify: string;
    competitor: string;
  }>;
};

export type HelpItem = {
  slug: string;
  title: string;
  summary: string;
  bullets: string[];
};

export type PricingPlan = {
  name: string;
  monthlyPrice: string;
  annualPrice: string;
  description: string;
  seats: string;
  cta: string;
  highlighted?: boolean;
  bullets: string[];
};

export const primaryNav = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/solutions", label: "Solutions" },
  { href: "/comparison", label: "Comparison" },
  { href: "/pricing", label: "Pricing" },
  { href: "/help", label: "Help" },
  { href: "/contact", label: "Contact" },
];

export const featureItems: FeatureItem[] = [
  {
    slug: "omnichannel-inbox",
    title: "Omnichannel Inbox",
    summary: "Manage website chat, social messaging, email, and voice interactions in one shared workspace.",
    bullets: ["Unified conversation routing", "Team assignment and SLA visibility", "Customer context in every thread"],
  },
  {
    slug: "ai-chatbot",
    title: "AI Chatbot",
    summary: "Automate repetitive conversations, qualify leads, and answer customer questions with contextual AI.",
    bullets: ["Intent-aware automation", "Lead qualification playbooks", "Continuous learning from live interactions"],
  },
  {
    slug: "ai-voicebot",
    title: "AI Voicebot",
    summary: "Handle inbound and outbound voice journeys with natural speech recognition and guided workflows.",
    bullets: ["Speech-to-intent handling", "Appointment and hotline flows", "Call summarization and QA hooks"],
  },
  {
    slug: "workflow-automation",
    title: "Workflow Automation",
    summary: "Build operational flows across service, sales, and retention without requiring engineering support.",
    bullets: ["No-code orchestration", "Triggers, conditions, and actions", "Cross-team lifecycle automation"],
  },
  {
    slug: "sales-crm",
    title: "Sales CRM",
    summary: "Track leads, deals, and customer milestones alongside support and communication history.",
    bullets: ["360-degree customer record", "Pipeline and task management", "Sales and CX alignment"],
  },
  {
    slug: "ticketing-sla",
    title: "Ticketing and SLA",
    summary: "Keep service quality measurable with ticket routing, escalation rules, and response-time commitments.",
    bullets: ["Smart ticket queues", "Escalation automation", "Agent and queue performance visibility"],
  },
  {
    slug: "reports-and-analytics",
    title: "Reports and Analytics",
    summary: "Measure conversation quality, resolution speed, sentiment, and business impact in real time.",
    bullets: ["Executive dashboards", "NPS and CSAT tracking", "Operational and revenue reporting"],
  },
  {
    slug: "security",
    title: "Security and Compliance",
    summary: "Support enterprise adoption with auditability, access control, and customer data protection.",
    bullets: ["Role-based permissions", "Audit trail readiness", "Privacy and compliance controls"],
  },
  {
    slug: "team-management",
    title: "Team Management",
    summary: "Coach agents, manage roles, and improve quality with AI-assisted team operations.",
    bullets: ["AI coaching", "Quality scoring", "Capacity and performance management"],
  },
  {
    slug: "integrations",
    title: "Integrations",
    summary: "Connect Zenify with payment tools, CRM systems, e-commerce platforms, and internal apps.",
    bullets: ["Commerce and CRM sync", "Webhook and API strategy", "Operational data consistency"],
  },
];

export const solutionItems: SolutionItem[] = [
  {
    slug: "ecommerce",
    title: "Zenify for E-commerce",
    summary: "Drive revenue with proactive assistance, order support, and post-purchase retention journeys.",
    bullets: ["Cart recovery and recommendations", "Order status and returns automation", "Loyalty and repeat-purchase flows"],
    challenges: ["High inquiry volume across campaigns", "Support disconnected from order data", "Slow returns and refund handling"],
    outcomes: ["Faster order resolution", "Higher conversion during browsing", "Better retention after purchase"],
    modules: ["Omnichannel Inbox", "AI Chatbot", "Workflow Automation", "Reports and Analytics"],
  },
  {
    slug: "healthcare",
    title: "Zenify for Healthcare",
    summary: "Coordinate patient communication, intake, service desks, and appointment automation securely.",
    bullets: ["Appointment workflows", "Patient inquiry handling", "Privacy-aware operations"],
    challenges: ["Fragmented patient touchpoints", "Heavy inbound call volume", "Sensitive data management"],
    outcomes: ["Lower missed-call rates", "Faster triage and appointment routing", "Better service consistency"],
    modules: ["AI Voicebot", "Ticketing and SLA", "Security and Compliance", "Team Management"],
  },
  {
    slug: "education",
    title: "Zenify for Education",
    summary: "Support students, applicants, and faculty with responsive multichannel communication.",
    bullets: ["Admissions support", "Student services", "Campus-wide knowledge flows"],
    challenges: ["Seasonal application spikes", "Repeated FAQ handling", "Disjointed support across departments"],
    outcomes: ["Higher applicant response speed", "Less agent repetition", "Clearer student support journeys"],
    modules: ["AI Chatbot", "Knowledge workflows", "Omnichannel Inbox", "Analytics"],
  },
  {
    slug: "enterprise",
    title: "Zenify for Enterprise",
    summary: "Operate large-scale CX teams across brands, markets, and regulated workflows.",
    bullets: ["Multi-team governance", "Advanced security", "Custom implementation support"],
    challenges: ["Multiple brands and queues", "Security and procurement reviews", "Complex role management"],
    outcomes: ["Centralized control", "Safer rollout across teams", "Operational standardization"],
    modules: ["Security and Compliance", "Team Management", "Workflow Automation", "Custom Integrations"],
  },
  {
    slug: "retail",
    title: "Zenify for Retail",
    summary: "Connect store operations, loyalty journeys, and assisted selling across digital and physical channels.",
    bullets: ["Store support queues", "Clienteling workflows", "Promotion and loyalty engagement"],
    challenges: ["Store and online experiences disconnected", "Promotion spikes cause service delays", "Weak post-purchase follow-up"],
    outcomes: ["Stronger omnichannel continuity", "Better staff responsiveness", "Improved loyalty engagement"],
    modules: ["Omnichannel Inbox", "Sales CRM", "AI Chatbot", "Reports and Analytics"],
  },
  {
    slug: "financial-services",
    title: "Zenify for Financial Services",
    summary: "Improve trust-heavy onboarding and service processes for lenders, insurers, and advisors.",
    bullets: ["Regulated communication flows", "High-trust service desk", "Lead-to-customer guidance"],
    challenges: ["Trust-sensitive interactions", "Escalation-heavy workflows", "Strict access policies"],
    outcomes: ["More structured client onboarding", "Better auditability", "Faster service resolution"],
    modules: ["Ticketing and SLA", "Security and Compliance", "AI Voicebot", "Analytics"],
  },
  {
    slug: "real-estate",
    title: "Zenify for Real Estate",
    summary: "Convert leads faster and coordinate buyer, seller, and broker journeys from one system.",
    bullets: ["Lead response automation", "Viewing coordination", "Broker support operations"],
    challenges: ["Leads cool down too quickly", "Agents coordinate through scattered tools", "Follow-up consistency is weak"],
    outcomes: ["Faster first response", "More organized viewings", "Clearer pipeline follow-up"],
    modules: ["Sales CRM", "Workflow Automation", "AI Chatbot", "Omnichannel Inbox"],
  },
  {
    slug: "hospitality",
    title: "Zenify for Hospitality",
    summary: "Deliver guest communication from reservation to post-stay follow-up across multiple properties.",
    bullets: ["Reservation support", "Guest messaging", "Concierge and retention flows"],
    challenges: ["Reservation questions arrive across channels", "Guest service needs 24/7 continuity", "Post-stay recovery is inconsistent"],
    outcomes: ["Smoother reservation support", "Faster guest assistance", "Better follow-up after issues"],
    modules: ["AI Voicebot", "Omnichannel Inbox", "Workflow Automation", "Reports and Analytics"],
  },
  {
    slug: "logistics",
    title: "Zenify for Logistics",
    summary: "Handle shipment inquiries, service exceptions, and account support at operational scale.",
    bullets: ["Shipment communication", "Escalation and SLA control", "Operational visibility"],
    challenges: ["Status requests overwhelm teams", "Delay escalations are manual", "Account communication is fragmented"],
    outcomes: ["Lower repetitive contact volume", "Better SLA adherence", "Clearer operational insight"],
    modules: ["Ticketing and SLA", "AI Chatbot", "Analytics", "Workflow Automation"],
  },
  {
    slug: "saas",
    title: "Zenify for SaaS",
    summary: "Unify product onboarding, customer success, and support into one revenue-oriented lifecycle system.",
    bullets: ["Trial activation support", "PLG upgrade prompts", "Customer success automation"],
    challenges: ["Trial users fail to activate", "Support and growth teams use different tools", "Expansion opportunities are missed"],
    outcomes: ["Higher trial conversion", "Better product adoption", "Stronger customer retention"],
    modules: ["Sales CRM", "Workflow Automation", "Reports and Analytics", "AI Coaching"],
  },
  {
    slug: "travel",
    title: "Zenify for Travel",
    summary: "Manage booking support, itinerary changes, and traveler care through live and automated channels.",
    bullets: ["Booking operations", "Traveler assistance", "High-volume seasonal handling"],
    challenges: ["Flight and itinerary disruptions", "Seasonal service spikes", "Multi-channel traveler updates"],
    outcomes: ["Faster traveler communication", "Lower manual update load", "Improved disruption handling"],
    modules: ["AI Voicebot", "Omnichannel Inbox", "Workflow Automation", "Ticketing and SLA"],
  },
  {
    slug: "b2b-services",
    title: "Zenify for B2B Services",
    summary: "Coordinate lead capture, proposal discussions, and long-cycle account support for service firms.",
    bullets: ["Lead-to-deal orchestration", "Service desk continuity", "Account relationship visibility"],
    challenges: ["Long follow-up cycles", "Weak visibility between sales and service", "Manual proposal coordination"],
    outcomes: ["Better lead progression", "Unified account context", "Improved cross-team execution"],
    modules: ["Sales CRM", "Omnichannel Inbox", "Workflow Automation", "Analytics"],
  },
];

export const comparisonItems: ComparisonItem[] = [
  {
    slug: "zendesk-alternative",
    title: "Zenify vs Zendesk",
    competitor: "Zendesk",
    summary: "A more unified CXM stack for teams that want communication, automation, CRM, and AI in one system.",
    strengths: ["Broader journey coverage", "Stronger trial-to-paid UX", "Simpler packaging strategy"],
    zenifyAdvantages: ["Marketing, sales, and service share one operating layer", "Built-in funnel from signup to billing to upgrade", "AI chatbot, voicebot, CRM, and automation in one structure"],
    buyerTriggers: ["You want one vendor for customer lifecycle operations", "Your current helpdesk feels disconnected from growth and sales", "You need simpler rollout for leaner teams"],
    comparisonRows: [
      { label: "Positioning", zenify: "Full CXM SaaS", competitor: "Support-first platform" },
      { label: "Trial-to-paid flow", zenify: "Built into site and app funnel", competitor: "Separate from core CX story" },
      { label: "AI voice capabilities", zenify: "Native direction", competitor: "Less central to product narrative" },
    ],
  },
  {
    slug: "livechat-alternative",
    title: "Zenify vs LiveChat",
    competitor: "LiveChat",
    summary: "Go beyond live chat with CRM, voice automation, billing flows, and lifecycle orchestration.",
    strengths: ["Broader product scope", "AI voice capabilities", "End-to-end SaaS funnel support"],
    zenifyAdvantages: ["Moves beyond chat tooling into full customer journey operations", "Connects support with billing and product-led growth", "Built for multichannel customer lifecycle management"],
    buyerTriggers: ["You have outgrown chat-first software", "You need CRM plus customer operations together", "You want more than support-side optimization"],
    comparisonRows: [
      { label: "Primary focus", zenify: "Customer experience lifecycle", competitor: "Chat and support efficiency" },
      { label: "Billing funnel depth", zenify: "Core platform journey", competitor: "Less central in product structure" },
      { label: "Operational breadth", zenify: "Marketing, sales, support, AI", competitor: "Support-centric" },
    ],
  },
  {
    slug: "intercom-alternative",
    title: "Zenify vs Intercom",
    competitor: "Intercom",
    summary: "A balanced CXM platform for businesses that need onboarding, support, automation, and sales alignment.",
    strengths: ["Unified CXM positioning", "Clearer operational structure", "Flexible pricing narrative"],
    zenifyAdvantages: ["Cleaner narrative for teams wanting one lifecycle stack", "Less fragmented route from acquisition to onboarding", "Pricing can stay more transparent for scale-up buyers"],
    buyerTriggers: ["You want more predictable packaging", "You need broader operational structure than product support alone", "You want service, growth, and AI in the same stack"],
    comparisonRows: [
      { label: "Commercial model", zenify: "Tiered SaaS plans", competitor: "Can feel more layered" },
      { label: "Lifecycle coverage", zenify: "Marketing to retention", competitor: "Strong but more product-support weighted" },
      { label: "Regional flexibility", zenify: "Can adapt for local market fit", competitor: "Global default posture" },
    ],
  },
  {
    slug: "freshchat-alternative",
    title: "Zenify vs Freshchat",
    competitor: "Freshchat",
    summary: "Designed for businesses that want AI-assisted communication paired with business-process depth.",
    strengths: ["Cross-functional workflows", "More complete customer lifecycle support", "AI coaching and QA"],
    zenifyAdvantages: ["Deeper workflow orchestration across teams", "Better path to sales and CX convergence", "AI coaching and QA are part of the operating model"],
    buyerTriggers: ["You want messaging tied to business processes", "You need stronger cross-functional visibility", "You care about service quality governance"],
    comparisonRows: [
      { label: "Workflow depth", zenify: "High", competitor: "Messaging-led" },
      { label: "QA and coaching", zenify: "Native operating layer", competitor: "Less central" },
      { label: "Cross-team model", zenify: "Sales + support + automation", competitor: "Support and chat weighted" },
    ],
  },
  {
    slug: "help-scout-alternative",
    title: "Zenify vs Help Scout",
    competitor: "Help Scout",
    summary: "A stronger fit for organizations that need both customer support operations and proactive growth tooling.",
    strengths: ["Omnichannel service model", "CRM and sales context", "Voice + chatbot + automation"],
    zenifyAdvantages: ["Moves past inbox management into lifecycle orchestration", "Adds revenue-facing CRM context", "Supports both service and growth motions"],
    buyerTriggers: ["You need more than email-centric service", "You want to unify support and customer growth", "You need voice and automation in the same product story"],
    comparisonRows: [
      { label: "Core use case", zenify: "Lifecycle CX platform", competitor: "Support simplicity" },
      { label: "Channel breadth", zenify: "Chat, social, email, voice", competitor: "More support-centric" },
      { label: "Expansion support", zenify: "Trial and upsell ready", competitor: "Less growth-oriented" },
    ],
  },
  {
    slug: "drift-alternative",
    title: "Zenify vs Drift",
    competitor: "Drift",
    summary: "A broader alternative for businesses that need conversational growth plus post-sale support operations.",
    strengths: ["Support and retention coverage", "Customer success use cases", "Billing and expansion flows"],
    zenifyAdvantages: ["Adds post-sale support and service desk structure", "Handles long-term customer operations better", "Stronger upgrade and retention framework"],
    buyerTriggers: ["You need support after acquisition, not just lead capture", "You want sales and service on one stack", "You want trial, billing, and upgrade control"],
    comparisonRows: [
      { label: "Lead generation", zenify: "Included in broader CX stack", competitor: "Primary emphasis" },
      { label: "Post-sale operations", zenify: "Core capability", competitor: "Less central" },
      { label: "Subscription lifecycle", zenify: "Integrated", competitor: "Less visible in site structure" },
    ],
  },
  {
    slug: "crisp-alternative",
    title: "Zenify vs Crisp",
    competitor: "Crisp",
    summary: "Built for teams that want a stronger enterprise and operations story around their messaging stack.",
    strengths: ["Workflow sophistication", "Team governance", "Enterprise readiness"],
    zenifyAdvantages: ["Better fit for structured service operations", "Richer governance and quality controls", "Stronger enterprise packaging direction"],
    buyerTriggers: ["You are moving from startup messaging tools into managed operations", "You need more formal quality controls", "You need a bigger systems story for leadership approval"],
    comparisonRows: [
      { label: "Governance", zenify: "Stronger operational controls", competitor: "Lighter-weight" },
      { label: "Enterprise fit", zenify: "More explicit", competitor: "Less central" },
      { label: "AI operations", zenify: "Broader across CX", competitor: "Messaging-focused" },
    ],
  },
  {
    slug: "tidio-alternative",
    title: "Zenify vs Tidio",
    competitor: "Tidio",
    summary: "A more scalable option for teams growing from live chat into full customer experience management.",
    strengths: ["Multi-team readiness", "Deeper analytics", "Cross-channel lifecycle orchestration"],
    zenifyAdvantages: ["Supports the move from small-team chat into mature operations", "Adds analytics and workflow layers for scale", "Enables cross-functional customer visibility"],
    buyerTriggers: ["Your support team is growing quickly", "You need better reporting and segmentation", "You need customer data shared across teams"],
    comparisonRows: [
      { label: "Scale readiness", zenify: "Designed for growth", competitor: "Small-team friendly" },
      { label: "Operational model", zenify: "Multi-team and multi-workflow", competitor: "Chat automation focused" },
      { label: "Customer record", zenify: "Shared context across lifecycle", competitor: "Less complete" },
    ],
  },
  {
    slug: "gorgias-alternative",
    title: "Zenify vs Gorgias",
    competitor: "Gorgias",
    summary: "A stronger full-journey platform for brands that want support, automation, and CRM in one place.",
    strengths: ["Beyond ticketing", "Sales + service convergence", "AI quality coaching"],
    zenifyAdvantages: ["Moves beyond support automation into broader CXM", "Better fit for service plus sales orchestration", "Stronger QA and team improvement layer"],
    buyerTriggers: ["You want more than commerce support workflows", "You need better team management and coaching", "You want lifecycle visibility beyond tickets"],
    comparisonRows: [
      { label: "Business scope", zenify: "Full CXM", competitor: "Support and commerce support stronghold" },
      { label: "Coaching layer", zenify: "Included in direction", competitor: "Less central" },
      { label: "Sales alignment", zenify: "Built in", competitor: "Less emphasized" },
    ],
  },
  {
    slug: "olark-alternative",
    title: "Zenify vs Olark",
    competitor: "Olark",
    summary: "A modern replacement for basic chat tooling when teams need structured CX operations and scale.",
    strengths: ["Modern AI layer", "Trial and billing design", "Vertical solution coverage"],
    zenifyAdvantages: ["Much broader modern CX capability set", "Clear SaaS funnel for acquisition and conversion", "Industry pages and AI-led differentiation"],
    buyerTriggers: ["You need to replace basic chat with a strategic platform", "You want AI and automation built in", "You need a clearer growth path"],
    comparisonRows: [
      { label: "Product maturity", zenify: "Modern CXM narrative", competitor: "Basic chat-oriented" },
      { label: "AI", zenify: "Core product layer", competitor: "Lighter" },
      { label: "Vertical packaging", zenify: "Supported by solutions pages", competitor: "Less broad" },
    ],
  },
  {
    slug: "smartsupp-alternative",
    title: "Zenify vs Smartsupp",
    competitor: "Smartsupp",
    summary: "A more expansive platform for businesses that want conversation channels tied to operational outcomes.",
    strengths: ["Analytics depth", "B2B and enterprise fit", "Unified customer record"],
    zenifyAdvantages: ["Supports both transactional and relationship-led service", "Adds structured analytics and shared account context", "Better enterprise messaging"],
    buyerTriggers: ["You need more insight than chat metrics", "You want cross-team customer visibility", "You want a more B2B-ready operating model"],
    comparisonRows: [
      { label: "Analytics depth", zenify: "Broader CX reporting", competitor: "Channel-focused" },
      { label: "Account context", zenify: "Shared record", competitor: "Lighter" },
      { label: "Enterprise story", zenify: "Explicit", competitor: "Less dominant" },
    ],
  },
  {
    slug: "tawk-to-alternative",
    title: "Zenify vs tawk.to",
    competitor: "tawk.to",
    summary: "A premium alternative for businesses ready to invest in measurable CX operations rather than only free chat.",
    strengths: ["Business process maturity", "Operational control", "Revenue-oriented onboarding"],
    zenifyAdvantages: ["Built for teams that need ROI, not just chat presence", "More structured customer operations", "Upgrade and retention flows are part of the product strategy"],
    buyerTriggers: ["Free chat no longer matches business complexity", "You need reporting, SLAs, and automation", "You want a platform that drives paid customer lifecycle value"],
    comparisonRows: [
      { label: "Commercial posture", zenify: "Paid SaaS with value ladder", competitor: "Free-first" },
      { label: "Operational depth", zenify: "Strong CX processes", competitor: "Simpler live chat" },
      { label: "Growth design", zenify: "Signup to upgrade journey", competitor: "Less central" },
    ],
  },
];

export const helpItems: HelpItem[] = [
  {
    slug: "get-started",
    title: "Get Started",
    summary: "Learn how to create a workspace, invite your team, and launch your first customer channels.",
    bullets: ["Account creation", "Workspace setup", "First-channel activation"],
  },
  {
    slug: "billing-and-trial",
    title: "Billing and Trial",
    summary: "Understand trial rules, card collection, invoicing, renewals, and plan upgrades.",
    bullets: ["15-day trial lifecycle", "Payment method setup", "Upgrade and renewal logic"],
  },
  {
    slug: "integrations",
    title: "Integrations",
    summary: "Connect Zenify to CRM, payments, e-commerce, and internal systems.",
    bullets: ["Commerce connectors", "CRM sync", "APIs and webhooks"],
  },
  {
    slug: "security",
    title: "Security",
    summary: "Review data protection controls, access management, and trusted-domain setup.",
    bullets: ["Access controls", "Compliance posture", "Data handling"],
  },
  {
    slug: "ai-features",
    title: "AI Features",
    summary: "Understand how chatbot, voicebot, sentiment analysis, and AI coaching behave.",
    bullets: ["Bot training principles", "Suggested replies", "Service quality automation"],
  },
  {
    slug: "onboarding",
    title: "Onboarding",
    summary: "Activate your workspace during the trial with guided milestones and adoption workflows.",
    bullets: ["Activation milestones", "Team enablement", "Trial-to-paid readiness"],
  },
];

export const appAreas = [
  { href: "/app", label: "Overview" },
  { href: "/app/dashboard", label: "Dashboard" },
  { href: "/app/inbox", label: "Inbox" },
  { href: "/app/automation", label: "Automation" },
  { href: "/app/analytics", label: "Analytics" },
  { href: "/app/billing", label: "Billing" },
  { href: "/app/settings", label: "Settings" },
];

export const pricingPlans: PricingPlan[] = [
  {
    name: "Starter",
    monthlyPrice: "$29",
    annualPrice: "$24",
    description: "For small teams starting with live support and structured customer conversations.",
    seats: "2 agent seats",
    cta: "Start Starter trial",
    bullets: ["Omnichannel inbox", "Basic automation", "Basic reporting", "Shared customer profile"],
  },
  {
    name: "Growth",
    monthlyPrice: "$79",
    annualPrice: "$65",
    description: "For scaling service and sales teams that need automation and customer visibility.",
    seats: "10 agent seats",
    cta: "Start Growth trial",
    highlighted: true,
    bullets: ["Workflow automation", "Sales CRM", "Advanced analytics", "AI chatbot playbooks"],
  },
  {
    name: "Business",
    monthlyPrice: "$149",
    annualPrice: "$129",
    description: "For high-volume teams that need AI operations, coaching, and service governance.",
    seats: "25 agent seats",
    cta: "Start Business trial",
    bullets: ["AI chatbot and voicebot", "QA and coaching", "Priority onboarding", "Advanced security controls"],
  },
  {
    name: "Enterprise",
    monthlyPrice: "Custom",
    annualPrice: "Custom",
    description: "For large organizations requiring security reviews, procurement support, and tailored delivery.",
    seats: "Custom seats",
    cta: "Talk to sales",
    bullets: ["Custom integrations", "Dedicated success team", "Security review support", "Multi-brand operations"],
  },
];

export const billingChecklist = [
  "Add payment method before workspace activation",
  "Preselect package and expected seat count",
  "Start trial with automatic paid conversion path",
];

export const signupChecklist = [
  "Business email, company name, and workspace URL",
  "Team size and primary use case",
  "Fast handoff into billing and activation",
];

export const trialMilestones = [
  { day: "Day 1", title: "Launch the workspace", text: "Connect channels, invite teammates, and set up your first routing rule." },
  { day: "Day 3", title: "Reach first value", text: "Handle live conversations and activate your first AI or automation flow." },
  { day: "Day 7", title: "Operationalize the team", text: "Turn on reporting, QA checkpoints, and shared customer visibility." },
  { day: "Day 15", title: "Convert to paid", text: "Upgrade the workspace into a paid plan without losing settings, data, or momentum." },
];

export function getFeature(slug: string) {
  return featureItems.find((item) => item.slug === slug);
}

export function getSolution(slug: string) {
  return solutionItems.find((item) => item.slug === slug);
}

export function getComparison(slug: string) {
  return comparisonItems.find((item) => item.slug === slug);
}

export function getHelpItem(slug: string) {
  return helpItems.find((item) => item.slug === slug);
}
