import type { Metadata } from "next";
import { use } from "react";
import { loginGithub } from "@/lib/sign.action";
import { GithubLoginButton } from "./GithubLoginButton";
import RegistForm from "./RegistForm";
import SignForm from "./SignForm";

export const metadata: Metadata = {
  title: "Hana Login Page",
  description: "Generat...",
};

export default function SignPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; isup?: string }>;
}) {
  const { callbackUrl, isup } = use(searchParams);
  const isRegist = !!isup;

  return (
    <div className="mx-auto w-96 rounded-md border p-5">
      <h1 className="mb-5 text-center font-semibold text-xl">
        Sign {isRegist ? "Up" : "In"}
      </h1>
      <form className="flex gap-3">
        <input type="hidden" name="redirectTo" value={callbackUrl || "/"} />
        <div className="grid grid-cols-2 place-items-center gap-5">
          <GithubLoginButton formAction={loginGithub} />
        </div>
      </form>

      {isRegist ? <RegistForm /> : <SignForm />}
    </div>
  );
}
