"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

interface iAppProps {
  text: string;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "primary"
    | "secondary"
    | null
    | undefined;
  icon?: React.ReactNode;
}

export default function SubmitButton({
  text,
  className,
  variant,
  icon,
}: iAppProps) {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled className={cn("w-fit", className)}>
          <Loader2 className="mr-2 size-4 animate-spin" />
          Please wait...
        </Button>
      ) : (
        <Button
          className={cn("w-fit", className)}
          variant={variant as any}
          type="submit"
        >
          {icon && <span className="mr-2">{icon}</span>}
          {text}
        </Button>
      )}
    </>
  );
}
