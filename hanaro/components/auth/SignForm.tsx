"use client";

import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignForm({ callbackUrl }: { callbackUrl: string }) {
  const params = useSearchParams();
  const redirectTo = callbackUrl || params.get("callbackUrl") || "/";

  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const passwd = String(form.get("passwd") ?? "");

    if (!email || !passwd) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    start(async () => {
      const res = await signIn("credentials", {
        email,
        passwd,
        callbackUrl: redirectTo,
        redirect: false,
      });
      if (res?.error) {
        setError("이메일 또는 비밀번호가 올바르지 않아요.");
        return;
      }
      // 성공
      window.location.href = redirectTo;
    });
  };

  return (
    <div className="grid place-items-center">
      <form onSubmit={onSubmit} className="w-full space-y-3">
        {error && (
          <div className="rounded-md border bg-red-50 p-3 text-sm text-red-600">
            {error}
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
          <Button type="submit" disabled={pending}>
            LogIn{pending ? "..." : ""}
          </Button>
        </div>
      </form>
    </div>
  );
}
