"use server"; // Menandakan bahwa file ini dijalankan di server.

import { redirect } from "next/navigation";
// Modul ini digunakan untuk mengarahkan pengguna ke URL yang berbeda.

import { parseWithZod } from "@conform-to/zod";
// Modul ini digunakan untuk memvalidasi data form menggunakan skema Zod.

import { postSchema, SiteCreationSchema } from "./app/utils/zodSchemas";
// Mengimpor skema validasi Zod untuk postingan dan pembuatan situs.

import prisma from "./app/utils/db";
// Mengimpor Prisma Client untuk berinteraksi dengan database.

import { requireUser } from "./app/utils/requireUser";
// Modul ini digunakan untuk memastikan bahwa pengguna sudah login.

import { stripe } from "./app/utils/stripe";
// Mengimpor Stripe untuk mengelola pembayaran dan langganan.

export async function CreateSiteAction(prevState: any, formData: FormData) {
    const user = await requireUser(); // Memastikan pengguna sudah login.

    // Mengambil status langganan dan daftar situs pengguna secara bersamaan.
    const [subStatus, sites] = await Promise.all([
        prisma.subscription.findUnique({
            where: { userId: user.id },
            select: { status: true },
        }),
        prisma.site.findMany({
            where: { userId: user.id },
        }),
    ]);

    // Jika pengguna tidak memiliki langganan aktif.
    if (!subStatus || subStatus.status !== "active") {
        if (sites.length < 1) { // Jika pengguna belum memiliki situs.
            const submission = await parseWithZod(formData, {
                schema: SiteCreationSchema({
                    async isSubdirectoryUnique() {
                        const exisitngSubDirectory = await prisma.site.findUnique({
                            where: { subdirectory: formData.get("subdirectory") as string },
                        });
                        return !exisitngSubDirectory;
                    },
                }),
                async: true,
            });

            if (submission.status !== "success") {
                return submission.reply(); // Mengembalikan kesalahan validasi.
            }

            // Membuat situs baru di database.
            const response = await prisma.site.create({
                data: {
                    description: submission.value.description,
                    name: submission.value.name,
                    subdirectory: submission.value.subdirectory,
                    userId: user.id,
                },
            });

            return redirect("/dashboard/sites"); // Mengarahkan ke halaman situs.
        } else {
            return redirect("/dashboard/pricing"); // Mengarahkan ke halaman harga.
        }
    } else if (subStatus.status === "active") { // Jika pengguna memiliki langganan aktif.
        const submission = await parseWithZod(formData, {
            schema: SiteCreationSchema({
                async isSubdirectoryUnique() {
                    const exisitngSubDirectory = await prisma.site.findUnique({
                        where: { subdirectory: formData.get("subdirectory") as string },
                    });
                    return !exisitngSubDirectory;
                },
            }),
            async: true,
        });

        if (submission.status !== "success") {
            return submission.reply(); // Mengembalikan kesalahan validasi.
        }

        // Membuat situs baru di database.
        const response = await prisma.site.create({
            data: {
                description: submission.value.description,
                name: submission.value.name,
                subdirectory: submission.value.subdirectory,
                userId: user.id,
            },
        });
        return redirect("/dashboard/sites"); // Mengarahkan ke halaman situs.
    }
}

export async function CreatePostAction(prevState: any, formData: FormData) {
    const user = await requireUser(); // Memastikan pengguna sudah login.

    const submission = parseWithZod(formData, {
        schema: postSchema,
    });

    if (submission.status !== "success") {
        return submission.reply(); // Mengembalikan kesalahan validasi.
    }

    // Membuat postingan baru di database.
    const data = await prisma.post.create({
        data: {
            title: submission.value.title,
            smallDescription: submission.value.smallDescription,
            slug: submission.value.slug,
            articleContent: JSON.parse(submission.value.articleContent),
            image: submission.value.coverImage,
            userId: user.id,
            siteId: formData.get("siteId") as string,
        },
    });

    return redirect(`/dashboard/sites/${formData.get("siteId")}`); // Mengarahkan ke halaman situs.
}

export async function EditPostAction(prevState: any, formData: FormData) {
    const user = await requireUser(); // Memastikan pengguna sudah login.

    const submission = parseWithZod(formData, {
        schema: postSchema,
    });

    if (submission.status !== "success") {
        return submission.reply(); // Mengembalikan kesalahan validasi.
    }

    // Memperbarui postingan di database.
    const data = await prisma.post.update({
        where: {
            userId: user.id,
            id: formData.get("articleId") as string,
            siteId: formData.get("siteId") as string,
        },
        data: {
            title: submission.value.title,
            smallDescription: submission.value.smallDescription,
            slug: submission.value.slug,
            articleContent: JSON.parse(submission.value.articleContent),
            image: submission.value.coverImage,
        }
    })

    return redirect(`/dashboard/sites/${formData.get("siteId")}`); // Mengarahkan ke halaman situs.
}

export async function DeletePostAction(formData: FormData) {
    const user = await requireUser(); // Memastikan pengguna sudah login.

    try {
        // Menghapus postingan dari database.
        await prisma.post.delete({
            where: {
                id: formData.get("articleId") as string,
                siteId: formData.get("siteId") as string,
                userId: user.id,
            }
        });
        return { success: true }; // Mengembalikan status sukses.
    } catch (error) {
        return { success: false, error: "An error occurred while deleting the post" }; // Mengembalikan status gagal.
    }
}

export async function UpdateImage(formData: FormData) {
    const user = await requireUser(); // Memastikan pengguna sudah login.

    // Memperbarui URL gambar situs di database.
    const data = await prisma.site.update({
        where: {
            userId: user.id,
            id: formData.get("siteId") as string,
        },
        data: {
            imageUrl: formData.get("imageUrl") as string,
        },
    });

    return redirect(`/dashboard/sites/${formData.get("siteId")}`); // Mengarahkan ke halaman situs.
}

export async function DeleteSite(formData: FormData) {
    const user = await requireUser(); // Memastikan pengguna sudah login.

    // Menghapus situs dari database.
    const data = await prisma.site.delete({
        where: {
            userId: user.id,
            id: formData.get("siteId") as string,
        },
    });

    return redirect("/dashboard/sites"); // Mengarahkan ke halaman situs.
}

export async function CreateSubscription() {
    const user = await requireUser(); // Memastikan pengguna sudah login.

    // Mengambil informasi pengguna dari database.
    let stripeUserId = await prisma.user.findUnique({
        where: { id: user.id },
        select: { customerId: true, email: true, firstName: true },
    });

    if (!stripeUserId?.customerId) {
        // Membuat pelanggan baru di Stripe jika belum ada.
        const stripeCustomer = await stripe.customers.create({
            email: stripeUserId?.email as string,
            name: stripeUserId?.firstName as string,
        });

        // Memperbarui informasi pengguna di database dengan customerId dari Stripe.
        stripeUserId = await prisma.user.update({
            where: { id: user.id },
            data: { customerId: stripeCustomer.id },
        });
    }

    // Membuat sesi checkout untuk langganan di Stripe.
    const session = await stripe.checkout.sessions.create({
        customer: stripeUserId.customerId as string,
        mode: "subscription",
        billing_address_collection: "auto",
        payment_method_types: ["card"],
        line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
        customer_update: { address: "auto", name: "auto" },
        success_url: 'http://localhost:3000/dashboard/payment/success',
        cancel_url: 'http://localhost:3000/dashboard/payment/cancelled',
    });

    return redirect(session.url as string); // Mengarahkan ke URL sesi checkout Stripe.
}