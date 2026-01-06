"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type LoginState, loginEmailAction } from "@/lib/sign/sign-in.action";

export default function SignForm({ callbackUrl }: { callbackUrl: string }) {
  const router = useRouter();
  const redirectTo = callbackUrl || "/";

  const [state, action, pending] = useActionState<LoginState, FormData>(
    loginEmailAction,
    undefined,
  );

  useEffect(() => {
    if (state?.ok) {
      router.replace(redirectTo as Route);
      router.refresh();
    }
  }, [state?.ok, router, redirectTo]);

  return (
    <div className="grid place-items-center">
      <form action={action} className="w-full space-y-3">
        <input type="hidden" name="redirectTo" value={redirectTo} />

        {state?.ok === false && (
          <div className="rounded-md border bg-red-50 p-3 text-sm text-red-600">
            {state.message}
          </div>
        )}

        <div className="space-y-1">
          <Label htmlFor="email">email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="user@email.com"
            disabled={pending}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="passwd">password</Label>
          <Input
            id="passwd"
            name="passwd"
            type="password"
            placeholder="password..."
            disabled={pending}
          />
        </div>

        <div className="flex justify-center gap-5">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(redirectTo as Route)}
            disabled={pending}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={pending}>
            LogIn{pending ? "..." : ""}
          </Button>
        </div>
      </form>
    </div>
  );
}
