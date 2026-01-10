import Link from "next/link";
import { GithubLoginButton } from "@/components/auth/GithubLoginButton";
import SignForm from "@/components/auth/SignForm";
import { loginGithub } from "@/lib/auth/sign-in.action";

type SP = { callbackUrl?: string };

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: SP | Promise<SP>;
}) {
  const sp = await Promise.resolve(searchParams ?? {});
  const callbackUrl = sp.callbackUrl ?? "/";

  return (
    <div className="mx-auto w-96 rounded-md border p-5">
      <h1 className="mb-5 text-center text-xl font-semibold">Sign In</h1>

      <form action={loginGithub} className="flex flex-col gap-3">
        <input type="hidden" name="redirectTo" value={callbackUrl} />
        <GithubLoginButton formAction={loginGithub} />
      </form>

      <div className="my-4 border-t" />

      <SignForm callbackUrl={callbackUrl} />

      <div className="mt-4 text-center text-sm text-muted-foreground">
        계정이 없나요?{" "}
        <Link
          href={`/auth/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          className="font-medium text-blue-600 hover:underline"
        >
          회원가입
        </Link>
      </div>
    </div>
  );
}
