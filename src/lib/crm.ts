import { db } from "@/lib/db";

const SIGNUP_LEAD_STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "DISQUALIFIED"] as const;
type SignupLeadStatus = (typeof SIGNUP_LEAD_STATUSES)[number];

function isSignupLeadStatus(input: string): input is SignupLeadStatus {
  return (SIGNUP_LEAD_STATUSES as readonly string[]).includes(input);
}

function normalizeWorkspaceSlug(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\.zenify\.cx\/?$/, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeEmail(input: string) {
  return input.trim().toLowerCase();
}

export async function createSignupLead(input: {
  email: string;
  company: string;
  workspaceSlug: string;
  teamSize: string;
  primaryGoal: string;
}) {
  const email = normalizeEmail(input.email);
  const company = input.company.trim();
  const workspaceSlug = normalizeWorkspaceSlug(input.workspaceSlug);

  if (!email || !company || !workspaceSlug || !input.teamSize || !input.primaryGoal) {
    throw new Error("Missing signup fields");
  }

  return db.signupLead.upsert({
    where: { email },
    update: {
      company,
      workspaceSlug,
      teamSize: input.teamSize,
      primaryGoal: input.primaryGoal,
      source: "website-signup",
      status: "NEW" as any,
      notes: null,
      contactedAt: null,
      convertedAt: null,
    },
    create: {
      email,
      company,
      workspaceSlug,
      teamSize: input.teamSize,
      primaryGoal: input.primaryGoal,
      source: "website-signup",
    },
  });
}

export async function listSignupLeads() {
  return db.signupLead.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });
}

export async function getSignupLeadSummary() {
  const leads = await db.signupLead.groupBy({
    by: ["status"],
    _count: { _all: true },
  });

  const summary = {
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    converted: 0,
    disqualified: 0,
  };

  for (const row of leads) {
    summary.total += row._count._all;

    if (row.status === "NEW") summary.new = row._count._all;
    if (row.status === "CONTACTED") summary.contacted = row._count._all;
    if (row.status === "QUALIFIED") summary.qualified = row._count._all;
    if (row.status === "CONVERTED") summary.converted = row._count._all;
    if (row.status === "DISQUALIFIED") summary.disqualified = row._count._all;
  }

  return summary;
}

export async function updateSignupLeadStatus(leadId: string, status: string) {
  if (!isSignupLeadStatus(status)) {
    throw new Error("Invalid signup lead status");
  }

  return db.signupLead.update({
    where: { id: leadId },
    data: {
      status: status as any,
      contactedAt: status === "CONTACTED" ? new Date() : undefined,
      convertedAt: status === "CONVERTED" ? new Date() : null,
    },
  });
}
