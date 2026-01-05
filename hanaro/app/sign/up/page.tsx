import type { Metadata } from "next";
import Link from "next/link";
import { use } from "react";
import RegistForm from "../../../components/sign/RegistForm";

export const metadata: Metadata = {
  title: "Hana Sign Up",
  description: "Sign up page",
};

export default function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = use(searchParams);

  return (
    <div className="mx-auto w-96 rounded-md border p-5">
      <h1 className="mb-5 text-center text-xl font-semibold">Sign Up</h1>

      <RegistForm />

      <div className="mt-4 text-center text-sm text-muted-foreground">
        이미 계정이 있나요?{" "}
        <Link
          href="/sign/in"
          className="font-medium text-blue-600 hover:underline"
        >
          로그인
        </Link>
      </div>
    </div>
  );
}
