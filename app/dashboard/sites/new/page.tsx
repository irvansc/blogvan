"use client";

import { CreateSiteAction } from "@/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useActionState } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { siteSchema } from "@/app/utils/zodSchemas";
import SubmitButton from "@/app/components/dashboard/SubmitButtons";

export default function NewSiteRoutes() {
  const [lastResult, action] = useActionState(CreateSiteAction, undefined);
  const [form, fields] = useForm({
    lastResult,

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: siteSchema });
    },

    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });
  return (
    <div className="flex flex-col items-center justify-center">
      <Card className="max-w-[450px]">
        <CardHeader>
          <CardTitle>Create a new site</CardTitle>
          <CardDescription>
            Create a new site to start tracking your traffic.
          </CardDescription>
        </CardHeader>
        <form id={form.id} onSubmit={form.onSubmit} action={action}>
          <CardContent>
            <div className="flex flex-col gap-y-6">
              <div className="grid gap-2">
                <Label>Site Name</Label>
                <Input
                  placeholder="Site Name"
                  name={fields.name.name}
                  key={fields.name.key}
                  defaultValue={fields.name.initialValue}
                />
                <p className="text-red-500 text-sm">
                  {fields.name.errors?.map((error) => error)}
                </p>
              </div>
              <div className="grid gap-2">
                <Label>Subdirectory</Label>
                <Input
                  placeholder="Subdirectory"
                  name={fields.subdirectory.name}
                  key={fields.subdirectory.key}
                  defaultValue={fields.subdirectory.initialValue}
                />
                <p className="text-red-500 text-sm">
                  {fields.subdirectory.errors?.map((error) => error)}
                </p>
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Small description about your site"
                  name={fields.description.name}
                  key={fields.description.key}
                  defaultValue={fields.description.initialValue}
                />
                <p className="text-red-500 text-sm">
                  {fields.description.errors?.map((error) => error)}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton text="Create Site" />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
