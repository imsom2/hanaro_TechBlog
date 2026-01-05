import type { Metadata } from "next";
import Link from "next/link";
import { use } from "react";
import { loginGithub } from "@/app/sign/api/sign-in.action";
import { GithubLoginButton } from "@/components/sign/GithubLoginButton";
import SignForm from "@/components/sign/SignForm";

export const metadata: Metadata = {
  title: "Hana Login Page",
  description: "Generat...",
};

export default function SignPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = use(searchParams);

  return (
    <div className="mx-auto w-96 rounded-md border p-5">
      <h1 className="mb-5 text-center text-xl font-semibold">Sign In</h1>
      <form className="flex gap-3">
        <input type="hidden" name="redirectTo" value={callbackUrl || "/"} />
        <div className="grid grid-cols-2 place-items-center gap-5">
          <GithubLoginButton formAction={loginGithub} />
        </div>
      </form>
      <div className="my-4 border-t" />
      <SignForm />{" "}
      <div className="mt-4 text-center text-sm text-muted-foreground">
        계정이 없나요?{" "}
        <Link
          href="/sign/up"
          className="font-medium text-blue-600 hover:underline"
        >
          회원가입
        </Link>
      </div>
    </div>
  );
}
