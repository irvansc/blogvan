import PricingTable from "@/app/components/dashboard/shared/Pricing";
// Mengimpor komponen PricingTable untuk menampilkan tabel harga.

import SubmitButton from "@/app/components/dashboard/SubmitButtons";
// Mengimpor komponen SubmitButton untuk membuat tombol submit.

import prisma from "@/app/utils/db";
// Mengimpor Prisma Client untuk berinteraksi dengan database.

import { requireUser } from "@/app/utils/requireUser";
// Mengimpor fungsi requireUser untuk memastikan pengguna sudah login.

import { stripe } from "@/app/utils/stripe";
// Mengimpor Stripe untuk mengelola pembayaran dan langganan.

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// Mengimpor komponen Card untuk menampilkan informasi dalam bentuk kartu.

import { redirect } from "next/navigation";
// Mengimpor fungsi redirect dari Next.js untuk mengarahkan pengguna.

import React from "react";
// Mengimpor React.

async function getData(userId: string) {
  // Fungsi untuk mengambil data langganan pengguna dari database.
  const data = await prisma.subscription.findUnique({
    where: {
      userId: userId,
    },
    select: {
      status: true,
      User: {
        select: {
          customerId: true,
        },
      },
    },
  });

  return data; // Mengembalikan data langganan.
}

export default async function PricingPage() {
  const user = await requireUser(); // Memastikan pengguna sudah login.
  const data = await getData(user.id); // Mengambil data langganan pengguna.

  async function createCustomerPortal() {
    "use server"; // Menandakan bahwa fungsi ini dijalankan di server.

    // Membuat sesi portal pelanggan di Stripe.
    const session = await stripe.billingPortal.sessions.create({
      customer: data?.User?.customerId as string,
      return_url:
        process.env.NODE_ENV === "production"
          ? "https://blog-van.vercel.app/dashboard"
          : "http://localhost:3000/dashboard",
    });

    return redirect(session.url); // Mengarahkan pengguna ke URL sesi portal pelanggan.
  }

  if (data?.status === "active") {
    // Jika status langganan pengguna aktif.
    return (
      <Card className="w-full ">
        <CardHeader>
          <CardTitle>Edit Subscription</CardTitle>
          <CardDescription>
            Click on the button below, this will give you the opportunity to
            change your payment details and view your statement at the same
            time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createCustomerPortal}>
            <SubmitButton text="View Subscription Details" />
          </form>
        </CardContent>
      </Card>
    );
  }

  // Jika status langganan pengguna tidak aktif.
  return (
    <div>
      <PricingTable />
      {/* Menampilkan tabel harga */}
    </div>
  );
}
