import Link from "next/link";
import RegistForm from "@/components/auth/RegistForm";

type SP = { callbackUrl?: string };

export default async function SignUpPage({
  searchParams,
}: {
  searchParams?: SP | Promise<SP>;
}) {
  const sp = await Promise.resolve(searchParams ?? {});
  const callbackUrl = sp.callbackUrl ?? "/";

  return (
    <div className="mx-auto w-96 rounded-md border p-5">
      <h1 className="mb-5 text-center text-xl font-semibold">Sign Up</h1>

      <RegistForm callbackUrl={callbackUrl} />

      <div className="mt-4 text-center text-sm text-muted-foreground">
        이미 계정이 있나요?{" "}
        <Link
          href={`/auth/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          className="font-medium text-blue-600 hover:underline"
        >
          로그인
        </Link>
      </div>
    </div>
  );
}
