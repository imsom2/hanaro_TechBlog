"use server";

import { signIn } from "@/lib/auth";

export async function loginGithub(formData: FormData) {
  const redirectTo = String(formData.get("redirectTo") ?? "/");

  await signIn("github", { redirectTo });
}
