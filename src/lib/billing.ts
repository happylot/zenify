import {
  InvoiceStatus,
  PaymentAttemptStatus,
  PlanChangeType,
  PlanCode,
  Prisma,
  SubscriptionStatus,
  TrialStatus,
  WorkspaceStatus,
} from "@prisma/client";
import { db } from "@/lib/db";

const BILLING_GRACE_DAYS = 5;

type PaypalWebhookEvent = {
  id: string;
  event_type: string;
  resource?: {
    id?: string;
    status?: string;
    billing_agreement_id?: string;
    supplementary_data?: {
      related_ids?: {
        order_id?: string;
        subscription_id?: string;
      };
    };
    amount?: {
      value?: string;
      currency_code?: string;
    };
    custom_id?: string;
    invoice_id?: string;
  };
};

function toAmount(value: Prisma.Decimal | number | string) {
  return Number(value).toFixed(2);
}

function getNextRenewalDate(date: Date, cycle: string) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + (cycle === "monthly" ? 1 : 12));
  return next;
}

function mapPlanCode(input: string) {
  switch (input.toUpperCase()) {
    case "STARTER":
      return PlanCode.STARTER;
    case "GROWTH":
      return PlanCode.GROWTH;
    case "BUSINESS":
      return PlanCode.BUSINESS;
    case "ENTERPRISE":
      return PlanCode.ENTERPRISE;
    default:
      throw new Error(`Unsupported plan code: ${input}`);
  }
}

function getResourceSubscriptionRef(event: PaypalWebhookEvent) {
  return (
    event.resource?.supplementary_data?.related_ids?.subscription_id ??
    event.resource?.billing_agreement_id ??
    event.resource?.id ??
    null
  );
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

export async function runTrialExpirySweep(now = new Date()) {
  const expiredTrials = await db.trial.findMany({
    where: { status: TrialStatus.ACTIVE, endsAt: { lte: now } },
    include: { workspace: true },
  });

  const processed: string[] = [];

  for (const trial of expiredTrials) {
    const hasPaymentMethod = Boolean(
      trial.workspace.paymentMethodBrand && trial.workspace.paymentMethodLast4,
    );

    if (hasPaymentMethod) {
      await db.$transaction([
        db.trial.update({
          where: { id: trial.id },
          data: { status: TrialStatus.CONVERTED, convertedAt: now },
        }),
        db.workspace.update({
          where: { id: trial.workspaceId },
          data: { status: WorkspaceStatus.ACTIVE },
        }),
        db.subscription.updateMany({
          where: { workspaceId: trial.workspaceId },
          data: { status: SubscriptionStatus.ACTIVE },
        }),
      ]);
    } else {
      await db.$transaction([
        db.trial.update({
          where: { id: trial.id },
          data: { status: TrialStatus.EXPIRED },
        }),
        db.workspace.update({
          where: { id: trial.workspaceId },
          data: { status: WorkspaceStatus.SUSPENDED },
        }),
      ]);
    }

    processed.push(trial.workspace.slug);
  }

  return { processedCount: processed.length, processed };
}

export async function runSubscriptionRenewalSweep(now = new Date()) {
  const dueSubscriptions = await db.subscription.findMany({
    where: {
      status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIALING] },
      renewsAt: { lte: now },
    },
    include: { workspace: { include: { customer: true } } },
  });

  const renewed: string[] = [];

  for (const subscription of dueSubscriptions) {
    const nextDate = getNextRenewalDate(subscription.renewsAt, subscription.billingCycle);
    const invoiceNumber = `INV-${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}${String(
      now.getUTCDate(),
    ).padStart(2, "0")}-${subscription.id.slice(-4).toUpperCase()}`;

    await db.$transaction([
      db.subscription.update({
        where: { id: subscription.id },
        data: {
          status: SubscriptionStatus.ACTIVE,
          currentPeriodStart: subscription.renewsAt,
          currentPeriodEnd: nextDate,
          renewsAt: nextDate,
        },
      }),
      db.invoice.create({
        data: {
          invoiceNumber,
          status: InvoiceStatus.OPEN,
          subtotal: subscription.unitAmount,
          taxAmount: new Prisma.Decimal(0),
          totalAmount: subscription.unitAmount,
          currency: subscription.currency,
          issuedAt: now,
          dueAt: now,
          customerId: subscription.workspace.customerId,
          workspaceId: subscription.workspaceId,
          subscriptionId: subscription.id,
        },
      }),
      db.paymentAttempt.create({
        data: {
          provider: subscription.provider,
          status: PaymentAttemptStatus.PENDING,
          amount: subscription.unitAmount,
          currency: subscription.currency,
          workspaceId: subscription.workspaceId,
          subscriptionId: subscription.id,
        },
      }),
    ]);

    renewed.push(subscription.workspace.slug);
  }

  return { processedCount: renewed.length, renewed };
}

export async function runFailedPaymentRecoverySweep(now = new Date()) {
  const invoices = await db.invoice.findMany({
    where: {
      status: { in: [InvoiceStatus.OPEN, InvoiceStatus.UNCOLLECTIBLE] },
      dueAt: { lte: now },
    },
    include: { subscription: true, workspace: true },
  });

  const retried: string[] = [];

  for (const invoice of invoices) {
    await db.paymentAttempt.create({
      data: {
        provider: invoice.subscription?.provider ?? "paypal",
        status: PaymentAttemptStatus.FAILED,
        amount: invoice.totalAmount,
        currency: invoice.currency,
        errorCode: "RETRY_SCHEDULED",
        errorMessage: "Retry scheduled by dunning sweep.",
        workspaceId: invoice.workspaceId,
        subscriptionId: invoice.subscriptionId ?? undefined,
        invoiceId: invoice.id,
      },
    });

    await db.subscription.updateMany({
      where: { id: invoice.subscriptionId ?? "__none__" },
      data: { status: SubscriptionStatus.PAST_DUE },
    });

    await db.workspace.update({
      where: { id: invoice.workspaceId },
      data: { status: WorkspaceStatus.PAST_DUE },
    });

    retried.push(invoice.invoiceNumber);
  }

  return { processedCount: retried.length, retried };
}

export async function runSuspensionSweep(now = new Date()) {
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - BILLING_GRACE_DAYS);

  const overdueWorkspaces = await db.workspace.findMany({
    where: {
      status: WorkspaceStatus.PAST_DUE,
      invoices: {
        some: {
          status: { in: [InvoiceStatus.OPEN, InvoiceStatus.UNCOLLECTIBLE] },
          dueAt: { lte: cutoff },
        },
      },
    },
  });

  const suspended: string[] = [];

  for (const workspace of overdueWorkspaces) {
    await lockWorkspace(workspace.id, "Automatic billing suspension after grace period");
    suspended.push(workspace.slug);
  }

  return { processedCount: suspended.length, suspended };
}

export async function recordBillingWebhookEvent(event: PaypalWebhookEvent) {
  return db.billingWebhookEvent.upsert({
    where: { eventId: event.id },
    update: {
      payload: event as Prisma.JsonObject,
      status: "received",
      errorMessage: null,
    },
    create: {
      provider: "paypal",
      eventId: event.id,
      eventType: event.event_type,
      resourceId: event.resource?.id,
      payload: event as Prisma.JsonObject,
    },
  });
}

export async function processPaypalWebhookEvent(event: PaypalWebhookEvent) {
  const webhookLog = await recordBillingWebhookEvent(event);
  const subscriptionRef = getResourceSubscriptionRef(event);

  try {
    if (event.event_type === "PAYMENT.SALE.COMPLETED" || event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
      const amount = event.resource?.amount?.value ?? "0";
      const currency = event.resource?.amount?.currency_code ?? "USD";
      const invoiceNumber = event.resource?.invoice_id;

      const invoice = invoiceNumber
        ? await db.invoice.findUnique({ where: { invoiceNumber } })
        : null;

      let workspaceId = invoice?.workspaceId;
      let subscriptionId = invoice?.subscriptionId;

      if ((!workspaceId || !subscriptionId) && subscriptionRef) {
        const subscription = await db.subscription.findFirst({
          where: { providerRef: subscriptionRef },
          include: { workspace: true },
        });

        workspaceId = subscription?.workspaceId;
        subscriptionId = subscription?.id;
      }

      if (!workspaceId) {
        throw new Error("No workspace matched the PayPal payment event");
      }

      await db.$transaction([
        db.paymentAttempt.create({
          data: {
            provider: "paypal",
            providerRef: event.resource?.id,
            status: PaymentAttemptStatus.SUCCEEDED,
            amount,
            currency,
            workspaceId,
            subscriptionId: subscriptionId ?? undefined,
            invoiceId: invoice?.id,
          },
        }),
        db.workspace.update({
          where: { id: workspaceId },
          data: { status: WorkspaceStatus.ACTIVE },
        }),
        db.subscription.updateMany({
          where: { id: subscriptionId ?? "__none__" },
          data: { status: SubscriptionStatus.ACTIVE },
        }),
        invoice
          ? db.invoice.update({
              where: { id: invoice.id },
              data: { status: InvoiceStatus.PAID, paidAt: new Date() },
            })
          : db.billingWebhookEvent.update({
              where: { id: webhookLog.id },
              data: { status: "processed" },
            }),
      ]);
    }

    if (event.event_type === "BILLING.SUBSCRIPTION.CANCELLED" && subscriptionRef) {
      await db.subscription.updateMany({
        where: { providerRef: subscriptionRef },
        data: { status: SubscriptionStatus.CANCELED, canceledAt: new Date() },
      });
    }

    if (
      (event.event_type === "BILLING.SUBSCRIPTION.PAYMENT.FAILED" ||
        event.event_type === "PAYMENT.SALE.DENIED") &&
      subscriptionRef
    ) {
      const subscription = await db.subscription.findFirst({
        where: { providerRef: subscriptionRef },
      });

      if (subscription) {
        await db.$transaction([
          db.paymentAttempt.create({
            data: {
              provider: "paypal",
              providerRef: event.resource?.id,
              status: PaymentAttemptStatus.FAILED,
              amount: event.resource?.amount?.value ?? subscription.unitAmount,
              currency: event.resource?.amount?.currency_code ?? subscription.currency,
              errorCode: event.resource?.status ?? "PAYPAL_FAILED",
              errorMessage: "PayPal reported a failed recurring payment.",
              workspaceId: subscription.workspaceId,
              subscriptionId: subscription.id,
            },
          }),
          db.subscription.update({
            where: { id: subscription.id },
            data: { status: SubscriptionStatus.PAST_DUE },
          }),
          db.workspace.update({
            where: { id: subscription.workspaceId },
            data: { status: WorkspaceStatus.PAST_DUE },
          }),
        ]);
      }
    }

    await db.billingWebhookEvent.update({
      where: { id: webhookLog.id },
      data: {
        status: "processed",
        processedAt: new Date(),
      },
    });

    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook processing failed";

    await db.billingWebhookEvent.update({
      where: { id: webhookLog.id },
      data: {
        status: "failed",
        errorMessage: message,
        processedAt: new Date(),
      },
    });

    throw error;
  }
}

export function parsePlanCode(value: string) {
  return mapPlanCode(value);
}
