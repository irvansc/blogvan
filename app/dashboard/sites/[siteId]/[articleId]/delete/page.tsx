"use client";
import { DeletePostAction } from "@/actions";
import SubmitButton from "@/app/components/dashboard/SubmitButtons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Trash } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

export default function DeleteRoute({
  params,
}: {
  params: { siteId: string; articleId: string };
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleDelete(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const response = await DeletePostAction(formData);
    setIsSubmitting(false);

    if (response.success) {
      toast.success("Article deleted successfully");
      window.location.href = `/dashboard/sites/${params.siteId}`;
    } else {
      toast.error(`Failed to delete article: ${response.error}`);
    }
  }
  return (
    <>
      <div className="flex flex-1 items-center justify-center">
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Are your absolutely sure?</CardTitle>
            <CardDescription>
              Are you sure you want to delete this article? This action cannot
              be undone.
            </CardDescription>
          </CardHeader>

          <CardFooter className="w-full flex justify-between">
            <Button
              className="bg-yellow-500/100 text-white hover:bg-yellow-500/70"
              asChild
            >
              <Link href={`/dashboard/sites/${params.siteId}`}>
                <ArrowLeft className="size-4 mr-2" />
                Cancel
              </Link>
            </Button>
            <form onSubmit={handleDelete}>
              <input type="hidden" name="articleId" value={params.articleId} />
              <input type="hidden" name="siteId" value={params.siteId} />
              <SubmitButton
                text="Delete"
                variant="destructive"
                icon={<Trash className="size-4" />}
              />
            </form>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
