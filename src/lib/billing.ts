import {
  InvoiceStatus,
  PlanChangeType,
  PlanCode,
  Prisma,
  SubscriptionStatus,
  WorkspaceStatus,
} from "@prisma/client";
import { db } from "@/lib/db";

function toAmount(value: Prisma.Decimal | number | string) {
  return Number(value).toFixed(2);
}

function getNextRenewalDate(date: Date, cycle: string) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + (cycle === "monthly" ? 1 : 12));
  return next;
}

export async function getBillingSummary() {
  const [trialWorkspaces, activeSubscriptions, openInvoices, mrr] = await Promise.all([
    db.workspace.count({ where: { status: WorkspaceStatus.TRIAL } }),
    db.subscription.count({
      where: { status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING] } },
    }),
    db.invoice.count({
      where: {
        status: { in: [InvoiceStatus.OPEN, InvoiceStatus.DRAFT, InvoiceStatus.UNCOLLECTIBLE] },
      },
    }),
    db.subscription.aggregate({
      _sum: { unitAmount: true },
      where: { status: SubscriptionStatus.ACTIVE },
    }),
  ]);

  return {
    trialWorkspaces,
    activeSubscriptions,
    openInvoices,
    monthlyRecurringRevenue: toAmount(mrr._sum.unitAmount ?? 0),
  };
}

export async function listCustomers() {
  return db.customer.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      workspaces: {
        include: {
          trial: true,
          subscription: true,
          accountLocks: {
            where: { active: true },
            orderBy: { lockedAt: "desc" },
            take: 1,
          },
        },
      },
    },
  });
}

export async function listSubscriptions() {
  return db.subscription.findMany({
    orderBy: { renewsAt: "asc" },
    include: {
      workspace: {
        include: { customer: true, accountLocks: { where: { active: true } } },
      },
      invoices: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      planChanges: {
        orderBy: { effectiveAt: "desc" },
        take: 1,
      },
    },
  });
}

export async function listInvoices() {
  return db.invoice.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: true,
      workspace: true,
      subscription: true,
    },
  });
}

export async function renewSubscription(subscriptionId: string) {
  const subscription = await db.subscription.findUnique({
    where: { id: subscriptionId },
  });

  if (!subscription) {
    throw new Error("Subscription not found");
  }

  const nextDate = getNextRenewalDate(subscription.renewsAt, subscription.billingCycle);

  return db.subscription.update({
    where: { id: subscriptionId },
    data: {
      status: SubscriptionStatus.ACTIVE,
      currentPeriodStart: subscription.renewsAt,
      currentPeriodEnd: nextDate,
      renewsAt: nextDate,
    },
  });
}

export async function schedulePlanChange(input: {
  subscriptionId: string;
  workspaceId: string;
  customerId: string;
  toPlan: PlanCode;
  toSeatCount: number;
  effectiveAt: Date;
}) {
  const subscription = await db.subscription.findUnique({
    where: { id: input.subscriptionId },
  });

  if (!subscription) {
    throw new Error("Subscription not found");
  }

  const currentWorkspace = await db.workspace.findUnique({
    where: { id: input.workspaceId },
  });

  if (!currentWorkspace) {
    throw new Error("Workspace not found");
  }

  return db.planChange.create({
    data: {
      type:
        input.toSeatCount >= currentWorkspace.seatCount
          ? PlanChangeType.UPGRADE
          : PlanChangeType.DOWNGRADE,
      fromPlan: subscription.planCode,
      toPlan: input.toPlan,
      fromSeatCount: currentWorkspace.seatCount,
      toSeatCount: input.toSeatCount,
      effectiveAt: input.effectiveAt,
      status: "scheduled",
      customerId: input.customerId,
      workspaceId: input.workspaceId,
      subscriptionId: input.subscriptionId,
    },
  });
}

export async function lockWorkspace(workspaceId: string, reason: string) {
  await db.accountLock.updateMany({
    where: { workspaceId, active: true },
    data: { active: false, unlockedAt: new Date() },
  });

  await db.subscription.updateMany({
    where: { workspaceId },
    data: { status: SubscriptionStatus.SUSPENDED },
  });

  return db.workspace.update({
    where: { id: workspaceId },
    data: {
      status: WorkspaceStatus.SUSPENDED,
      accountLocks: {
        create: {
          reason,
          active: true,
        },
      },
    },
    include: { accountLocks: true },
  });
}

export async function unlockWorkspace(workspaceId: string) {
  await db.accountLock.updateMany({
    where: { workspaceId, active: true },
    data: { active: false, unlockedAt: new Date() },
  });

  await db.subscription.updateMany({
    where: { workspaceId, status: SubscriptionStatus.SUSPENDED },
    data: { status: SubscriptionStatus.ACTIVE },
  });

  return db.workspace.update({
    where: { id: workspaceId },
    data: { status: WorkspaceStatus.ACTIVE },
    include: { accountLocks: true },
  });
}

export async function markInvoicePaid(invoiceId: string) {
  return db.invoice.update({
    where: { id: invoiceId },
    data: {
      status: InvoiceStatus.PAID,
      paidAt: new Date(),
    },
  });
}
