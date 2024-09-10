"use server";
// Menandakan bahwa file ini dijalankan di server.

import { EmptyState } from "@/app/components/dashboard/EmptyState";
// Mengimpor komponen EmptyState untuk menampilkan pesan ketika tidak ada artikel.

import prisma from "@/app/utils/db";
// Mengimpor Prisma Client untuk berinteraksi dengan database.

import { Badge } from "@/components/ui/badge";
// Mengimpor komponen Badge untuk menampilkan status artikel.

import { Button } from "@/components/ui/button";
// Mengimpor komponen Button untuk membuat tombol.

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// Mengimpor komponen Card untuk menampilkan daftar artikel dalam bentuk kartu.

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// Mengimpor komponen DropdownMenu untuk menampilkan menu tindakan pada artikel.

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// Mengimpor komponen Table untuk menampilkan daftar artikel dalam bentuk tabel.

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
// Mengimpor fungsi untuk mendapatkan sesi pengguna dari Kinde.

import {
  FileIcon,
  MoreHorizontal,
  PlusIcon,
  SettingsIcon,
  ViewIcon,
} from "lucide-react";
// Mengimpor ikon dari lucide-react untuk digunakan dalam tombol dan menu.

import Image from "next/image";
// Mengimpor komponen Image dari Next.js untuk menampilkan gambar.

import Link from "next/link";
// Mengimpor komponen Link dari Next.js untuk navigasi.

import { redirect } from "next/navigation";
// Mengimpor fungsi redirect dari Next.js untuk mengarahkan pengguna.

import React from "react";
// Mengimpor React.

async function getData(siteId: string, userId: string) {
  // Fungsi untuk mengambil data situs dan artikel dari database.

  // const data = await prisma.post.findMany({
  //   where: {
  //     siteId: siteId,
  //     userId: userId,
  //   },
  //   select: {
  //     id: true,
  //     title: true,
  //     image: true,
  //     createdAt: true,
  //     Site: {
  //       select: {
  //         subdirectory: true,
  //       },
  //     },
  //   },
  //   orderBy: {
  //     createdAt: "desc",
  //   },
  // });

  const data = await prisma.site.findUnique({
    where: {
      id: siteId,
      userId: userId,
    },
    select: {
      subdirectory: true,
      posts: {
        select: {
          image: true,
          title: true,
          createdAt: true,
          id: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  return data;
}

export default async function siteIdRoutes({
  params,
}: {
  params: { siteId: string };
}) {
  const { getUser } = getKindeServerSession();
  const user = await getUser(); // Mendapatkan pengguna yang sedang login.
  if (!user) {
    return redirect("/api/auth/login"); // Mengarahkan ke halaman login jika pengguna belum login.
  }

  const data = await getData(params.siteId, user.id); // Mengambil data situs dan artikel.
  return (
    <>
      <div className="flex w-full justify-end gap-x-4">
        <Button asChild variant="outline">
          <Link href={`/blog/${data?.subdirectory}`}>
            <ViewIcon className="w-4 h-4 mr-2" />
            View Blog
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={`/dashboard/sites/${params.siteId}/settings`}>
            <SettingsIcon className="w-4 h-4 mr-2" />
            Settings
          </Link>
        </Button>
        <Button asChild>
          <Link href={`/dashboard/sites/${params.siteId}/create`}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Article
          </Link>
        </Button>
      </div>

      {data?.posts === undefined || data?.posts.length === 0 ? (
        <EmptyState
          title="No Article found"
          description="You currently don't have any Article. Please create some so
            that you can start tracking your traffic."
          buttonText="Create Article"
          href={`/dashboard/sites/${params.siteId}/create`}
        />
      ) : (
        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                <h1>Article List</h1>
              </CardTitle>
              <CardDescription>
                <p>
                  Manage your articles in an simple and intuitive interface.
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.posts.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={64}
                          height={64}
                          className="rounded-md object-cover size-16"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.title}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-500/10 text-green-500"
                        >
                          Published
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Intl.DateTimeFormat("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(new Date(item.createdAt))}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/dashboard/sites/${params.siteId}/${item.id}`}
                              >
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link
                                href={`/dashboard/sites/${params.siteId}/${item.id}/delete`}
                              >
                                Delete
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
