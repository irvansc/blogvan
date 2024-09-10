import prisma from "@/app/utils/db";
// Mengimpor Prisma Client untuk berinteraksi dengan database.

import { stripe } from "@/app/utils/stripe";
// Mengimpor Stripe untuk mengelola pembayaran dan langganan.

import { headers } from "next/headers";
// Mengimpor modul headers dari Next.js untuk mendapatkan header dari request.

import Stripe from "stripe";
// Mengimpor Stripe SDK.

export async function POST(req: Request) {
  const body = await req.text();
  // Membaca body dari request sebagai teks.

  const signature = headers().get("Stripe-Signature") as string;
  // Mendapatkan signature dari header request.

  let event: Stripe.Event;

  try {
    // Membangun event Stripe dari body dan signature.
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error: unknown) {
    // Mengembalikan respons error jika konstruksi event gagal.
    return new Response("Webhook error", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  // Mendapatkan objek sesi dari event.

  if (event.type === "checkout.session.completed") {
    // Jika event adalah checkout session yang selesai.
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    // Mengambil detail langganan dari Stripe.

    const customerId = session.customer as string;
    // Mendapatkan customerId dari sesi.

    const user = await prisma.user.findUnique({
      where: {
        customerId: customerId,
      },
    });
    // Mencari pengguna di database berdasarkan customerId.

    if (!user) throw new Error("User not found...");
    // Jika pengguna tidak ditemukan, lempar error.

    // Membuat entri langganan baru di database.
    await prisma.subscription.create({
      data: {
        stripeSubscriptionId: subscription.id,
        userId: user.id,
        currentPeriodStart: subscription.current_period_start,
        currentPeriodEnd: subscription.current_period_end,
        status: subscription.status,
        planId: subscription.items.data[0].plan.id,
        interval: String(subscription.items.data[0].plan.interval),
      },
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    // Jika event adalah pembayaran invoice yang berhasil.
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    // Mengambil detail langganan dari Stripe.

    // Memperbarui entri langganan di database.
    await prisma.subscription.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        planId: subscription.items.data[0].price.id,
        currentPeriodStart: subscription.current_period_start,
        currentPeriodEnd: subscription.current_period_end,
        status: subscription.status,
      },
    });
  }

  return new Response(null, { status: 200 });
  // Mengembalikan respons sukses.
}
