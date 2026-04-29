import {
  InvoiceStatus,
  PaymentAttemptStatus,
  PlanChangeType,
  PlanCode,
  PrismaClient,
  SubscriptionStatus,
  TrialStatus,
  WorkspaceStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.paymentAttempt.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.planChange.deleteMany();
  await prisma.accountLock.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.trial.deleteMany();
  await prisma.workspace.deleteMany();
  await prisma.customer.deleteMany();

  const nova = await prisma.customer.create({
    data: {
      name: "Hang Nguyen",
      email: "hang@novaretail.vn",
      company: "Nova Retail",
      country: "VN",
      workspaces: {
        create: {
          slug: "nova-retail",
          name: "Nova Retail",
          status: WorkspaceStatus.TRIAL,
          currentPlan: PlanCode.GROWTH,
          seatCount: 10,
          trialEndsAt: new Date("2026-05-03T00:00:00.000Z"),
          autoRenew: true,
          paymentMethodBrand: "Visa",
          paymentMethodLast4: "4092",
          trial: {
            create: {
              status: TrialStatus.ACTIVE,
              endsAt: new Date("2026-05-03T00:00:00.000Z"),
              activationRate: 80,
            },
          },
        },
      },
    },
    include: { workspaces: true },
  });

  const globalTravel = await prisma.customer.create({
    data: {
      name: "Tran Khang",
      email: "cto@globaltravel.com",
      company: "Global Travel",
      country: "VN",
      workspaces: {
        create: {
          slug: "global-travel",
          name: "Global Travel",
          status: WorkspaceStatus.ACTIVE,
          currentPlan: PlanCode.GROWTH,
          seatCount: 18,
          autoRenew: true,
          paymentMethodBrand: "Mastercard",
          paymentMethodLast4: "8104",
          subscription: {
            create: {
              provider: "paypal",
              providerRef: "PAYPAL-SUB-GT-001",
              status: SubscriptionStatus.ACTIVE,
              planCode: PlanCode.GROWTH,
              billingCycle: "annual",
              unitAmount: "65",
              currency: "USD",
              currentPeriodStart: new Date("2025-06-12T00:00:00.000Z"),
              currentPeriodEnd: new Date("2026-06-12T00:00:00.000Z"),
              renewsAt: new Date("2026-06-12T00:00:00.000Z"),
            },
          },
        },
      },
    },
    include: { workspaces: { include: { subscription: true } } },
  });

  const workspace = globalTravel.workspaces[0];
  const subscription = workspace.subscription;

  if (subscription) {
    await prisma.invoice.create({
      data: {
        invoiceNumber: "INV-2026-0418",
        status: InvoiceStatus.PAID,
        subtotal: "1170",
        taxAmount: "0",
        totalAmount: "1170",
        currency: "USD",
        issuedAt: new Date("2026-04-18T00:00:00.000Z"),
        dueAt: new Date("2026-05-01T00:00:00.000Z"),
        paidAt: new Date("2026-04-19T00:00:00.000Z"),
        exportUrl: "/exports/INV-2026-0418.pdf",
        customerId: globalTravel.id,
        workspaceId: workspace.id,
        subscriptionId: subscription.id,
      },
    });

    await prisma.planChange.create({
      data: {
        type: PlanChangeType.UPGRADE,
        fromPlan: PlanCode.GROWTH,
        toPlan: PlanCode.BUSINESS,
        fromSeatCount: 18,
        toSeatCount: 25,
        effectiveAt: new Date("2026-06-12T00:00:00.000Z"),
        status: "scheduled",
        customerId: globalTravel.id,
        workspaceId: workspace.id,
        subscriptionId: subscription.id,
      },
    });

    await prisma.paymentAttempt.create({
      data: {
        provider: "paypal",
        providerRef: "PAYPAL-ATTEMPT-GT-001",
        status: PaymentAttemptStatus.SUCCEEDED,
        amount: "1170",
        currency: "USD",
        workspaceId: workspace.id,
        subscriptionId: subscription.id,
      },
    });
  }

  await prisma.accountLock.create({
    data: {
      reason: "Auto-lock after failed billing grace period",
      active: false,
      lockedAt: new Date("2026-04-10T00:00:00.000Z"),
      unlockedAt: new Date("2026-04-11T00:00:00.000Z"),
      workspaceId: nova.workspaces[0].id,
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
