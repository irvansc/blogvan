import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
// Mengimpor fungsi untuk mendapatkan sesi pengguna dari Kinde.

import { redirect } from "next/navigation";
// Mengimpor fungsi redirect dari Next.js untuk mengarahkan pengguna.

import { Hero } from "./components/frontend/Hero";
// Mengimpor komponen Hero untuk menampilkan bagian hero di halaman.

import { Logos } from "./components/frontend/Logos";
// Mengimpor komponen Logos untuk menampilkan logo di halaman.

import { Features } from "./components/frontend/Features";
// Mengimpor komponen Features untuk menampilkan fitur di halaman.

import PricingTable from "./components/dashboard/shared/Pricing";
// Mengimpor komponen PricingTable untuk menampilkan tabel harga.

export default async function Home() {
  const { getUser } = getKindeServerSession();
  // Mendapatkan fungsi getUser dari sesi Kinde.

  const session = await getUser();
  // Mendapatkan sesi pengguna.

  if (session?.id) {
    return redirect("/dashboard");
    // Jika pengguna sudah login, mengarahkan ke halaman dashboard.
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
      {/* Menampilkan komponen-komponen halaman utama */}
      <Hero />
      {/* Menampilkan bagian hero */}
      <Logos />
      {/* Menampilkan logo */}
      <Features />
      {/* Menampilkan fitur */}
      <PricingTable />
      {/* Menampilkan tabel harga */}
    </div>
  );
}
