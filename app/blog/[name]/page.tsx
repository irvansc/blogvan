import prisma from "@/app/utils/db";
// Mengimpor Prisma Client untuk berinteraksi dengan database.

import Image from "next/image";
// Mengimpor komponen Image dari Next.js untuk menampilkan gambar.

import { notFound } from "next/navigation";
// Mengimpor fungsi notFound dari Next.js untuk menampilkan halaman 404 jika data tidak ditemukan.

import Logo from "@/public/logo.svg";
// Mengimpor logo untuk ditampilkan di halaman.

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// Mengimpor komponen Card untuk menampilkan artikel dalam bentuk kartu.

import Defaultimage from "@/public/default.png";
// Mengimpor gambar default untuk artikel yang tidak memiliki gambar.

import { Button } from "@/components/ui/button";
// Mengimpor komponen Button untuk membuat tombol.

import Link from "next/link";
// Mengimpor komponen Link dari Next.js untuk navigasi.

import { ModeToggle } from "@/app/components/dashboard/ThemeToggle";
// Mengimpor komponen ModeToggle untuk mengubah tema.

async function getData(subDir: string) {
  // Fungsi untuk mengambil data situs dan artikel dari database berdasarkan subdirektori.
  const data = await prisma.site.findUnique({
    where: {
      subdirectory: subDir,
    },
    select: {
      name: true,
      posts: {
        select: {
          smallDescription: true,
          title: true,
          image: true,
          createdAt: true,
          slug: true,
          id: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!data) {
    return notFound(); // Mengembalikan halaman 404 jika data tidak ditemukan.
  }

  return data; // Mengembalikan data situs dan artikel.
}

export default async function BlogIndexPage({
  params,
}: {
  params: { name: string };
}) {
  const data = await getData(params.name); // Mengambil data situs dan artikel berdasarkan parameter URL.

  return (
    <>
      <nav className="grid grid-cols-3 my-10">
        <div className="col-span-1" />
        <div className="flex items-center gap-x-4 justify-center">
          <Link href="/dashboard">
            <Image src={Logo} alt="Logo" width={40} height={40} />
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight">{data.name}</h1>
        </div>

        <div className="col-span-1 flex w-full justify-end">
          <ModeToggle />
        </div>
      </nav>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
        {data.posts.map((item) => (
          <Card key={item.id}>
            <Image
              src={item.image ?? Defaultimage}
              alt={item.title}
              className="rounded-t-lg object-cover w-full h-[200px]"
              width={400}
              height={200}
            />
            <CardHeader>
              <CardTitle className="truncate">{item.title}</CardTitle>
              <CardDescription className="line-clamp-3">
                {item.smallDescription}
              </CardDescription>
            </CardHeader>

            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/blog/${params.name}/${item.slug}`}>
                  Read more
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
