import prisma from "@/app/utils/db";
import React from "react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import EditArticleForm from "@/app/components/dashboard/forms/EditArticleForm";
async function getData(postId: string) {
  const data = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      title: true,
      image: true,
      slug: true,
      smallDescription: true,
      articleContent: true,
      id: true,
    },
  });
  if (!data) {
    return notFound();
  }
  return data;
}

export default async function EditRoute({
  params,
}: {
  params: { articleId: string; siteId: string };
}) {
  const data = await getData(params.articleId);

  return (
    <div>
      <div className="flex items-center">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/dashboard/sites/${params.siteId}`}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold ml-4">Edit Article</h1>
      </div>
      <EditArticleForm data={data} siteId={params.siteId} />
    </div>
  );
}
