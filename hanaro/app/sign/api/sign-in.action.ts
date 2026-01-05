"use server";

import { AuthError } from "next-auth";
import z from "zod";
import { signIn } from "@/lib/auth";
import type { ValidError } from "@/lib/validator";
import { validate } from "@/lib/validator";

export type Provider = "github" | "credentials";

const login = async (provider: Provider, formData: FormData) => {
  const redirectTo = (formData.get("redirectTo") as string) || "/";
  await signIn(provider, { redirectTo });
};

export const loginGithub = async (formData: FormData) =>
  login("github", formData);

export const loginEmail = async (formData: FormData) => {
  const zobj = z.object({
    email: z.email("Invalid Email Address!"),
    passwd: z.string().min(3, "Password is more than 3 characters!"),
  });

  const [err, data] = validate(zobj, formData);
  if (err) return [err] as const;

  try {
    // ✅ credentials provider authorize로 넘어감
    await signIn("credentials", { redirect: false, ...data });
    return [undefined, data] as const;
  } catch (err) {
    if (err instanceof AuthError) {
      const msg = err.message || "EmailSignInError";
      const email = msg.includes("Read more")
        ? msg.substring(0, msg.indexOf("Read more"))
        : msg;

      return [{ error: { email }, data } satisfies ValidError] as const;
    }

    return [
      { error: { email: JSON.stringify(err) }, data } satisfies ValidError,
    ] as const;
  }
};
