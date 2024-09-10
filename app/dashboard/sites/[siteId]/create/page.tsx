"use client";

import { CreatePostAction } from "@/actions";
import TailwindEditor from "@/app/components/dashboard/EditorWrapper";
import { UploadDropzone } from "@/app/utils/uploadthingComponents";
import { postSchema } from "@/app/utils/zodSchemas";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { ArrowLeftIcon, Atom, SendIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { JSONContent } from "novel";
import React, { useActionState, useState } from "react";
import { toast } from "sonner";
import slugify from "react-slugify";
import SubmitButton from "@/app/components/dashboard/SubmitButtons";
export default function ArticleCreateRoute({
  params,
}: {
  params: { siteId: string };
}) {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [value, setValue] = useState<JSONContent | undefined>(undefined);
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [slug, setSlugValue] = useState<string | undefined>(undefined);
  const [lastResult, action] = useActionState(CreatePostAction, undefined);
  const [form, fields] = useForm({
    lastResult,

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: postSchema });
    },

    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  function handleSlugifyGeneration() {
    const titleInput = title;
    if (titleInput?.length === 0 || titleInput === undefined) {
      return toast.error("Please enter a title first");
    }
    setSlugValue(slugify(titleInput));

    return toast.success("Slug generated successfully");
  }

  return (
    <>
      <div className="flex items-center">
        <Button asChild size="icon" variant="outline" className="mr-4">
          <Link href={`/dashboard/sites/${params.siteId}`}>
            <ArrowLeftIcon className="size-4" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold">Create Article</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Article Details</CardTitle>
          <CardDescription>
            Add the details of the article you want to create.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-6"
            id={form.id}
            onSubmit={form.onSubmit}
            action={action}
          >
            <input type="hidden" name="siteId" value={params.siteId} />
            <div className="grid gap-2">
              <Label>Title</Label>
              <Input
                placeholder="Article Title"
                name={fields.title.name}
                key={fields.title.key}
                defaultValue={fields.title.initialValue}
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
              <p className="text-red-500 text-sm">
                {fields.title.errors?.map((error) => error)}
              </p>
            </div>
            <div className="grid gap-2">
              <Label>Slug</Label>
              <Input
                placeholder="Article Slug"
                name={fields.slug.name}
                key={fields.slug.key}
                defaultValue={fields.slug.initialValue}
                onChange={(e) => setSlugValue(e.target.value)}
                value={slug}
              />
              <Button
                className="w-fit"
                variant="secondary"
                type="button"
                onClick={handleSlugifyGeneration}
              >
                <Atom className="size-4 mr-2" />
                Generate Slug
              </Button>
              <p className="text-red-500 text-sm">
                {fields.slug.errors?.map((error) => error)}
              </p>
            </div>
            <div className="grid gap-2">
              <Label>Small Description</Label>
              <Textarea
                placeholder="Article Small Description"
                className="h-32"
                name={fields.smallDescription.name}
                key={fields.smallDescription.key}
                defaultValue={fields.smallDescription.initialValue}
              />
              <p className="text-red-500 text-sm">
                {fields.smallDescription.errors?.map((error) => error)}
              </p>
            </div>
            <div className="grid gap-2">
              <Label>Cover Image</Label>
              <input
                type="hidden"
                name={fields.coverImage.name}
                key={fields.coverImage.key}
                defaultValue={fields.coverImage.initialValue}
                value={imageUrl}
              />
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="uploaded image"
                  width={300}
                  height={300}
                  className="object-cover w-[300px] h-[300px] rounded-lg"
                />
              ) : (
                <UploadDropzone
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    setImageUrl(res[0].url);
                    toast.success("Image uploaded successfully");
                  }}
                  onUploadError={(error) => {
                    toast.error("Error uploading image");
                  }}
                />
              )}
              <p className="text-red-500 text-sm">
                {fields.coverImage.errors?.map((error) => error)}
              </p>
            </div>
            <div className="grid gap-2">
              <Label>Article Content</Label>
              <p className="text-sm text-muted-foreground">
                Use <span className="font-bold text-primary">/</span> to open
                the Editor Command menu.
              </p>
              <input
                type="hidden"
                name={fields.articleContent.name}
                key={fields.articleContent.key}
                defaultValue={fields.articleContent.initialValue}
                value={JSON.stringify(value)}
              />
              <TailwindEditor onChange={setValue} initialValue={value} />
              <p className="text-red-500 text-sm">
                {fields.articleContent.errors}
              </p>
            </div>
            <SubmitButton text="Create Article" className="w-fit self-end" />
          </form>
        </CardContent>
      </Card>
    </>
  );
}
