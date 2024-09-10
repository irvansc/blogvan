import { DeleteSite } from "@/actions";
import { UploadImageForm } from "@/app/components/dashboard/forms/UploadImageForm";
import SubmitButton from "@/app/components/dashboard/SubmitButtons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function SettingsSiteRoute({
  params,
}: {
  params: { siteId: string };
}) {
  return (
    <>
      <div className="flex items-center gap-x-2">
        <Button asChild variant="outline" size="icon">
          <Link href={`/dashboard/sites/${params.siteId}`}>
            <ArrowLeft className="size-4 mr-2" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      <UploadImageForm siteId={params.siteId} />
      <Card className="border-red-500 bg-red-500/10">
        <CardHeader>
          <CardTitle className="text-red-500">Danger</CardTitle>
          <CardDescription>
            This will delete your site and all articles associated with it.
            Click the button below to delete everything
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <form action={DeleteSite}>
            <input type="hidden" name="siteId" value={params.siteId} />
            <SubmitButton text="Delete Everything" variant="destructive" />
          </form>
        </CardFooter>
      </Card>
    </>
  );
}
