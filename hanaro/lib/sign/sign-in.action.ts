"use server";

import { AuthError } from "next-auth";
import z from "zod";
import { signIn } from "@/lib/auth";
import { validate } from "@/lib/validator";

export type Provider = "github" | "credentials";

const login = async (provider: Provider, formData: FormData) => {
  const redirectTo = (formData.get("redirectTo") as string) || "/";
  await signIn(provider, { redirectTo });
};

export const loginGithub = async (formData: FormData) =>
  login("github", formData);

export type LoginState =
  | { ok: true }
  | { ok: false; message: string; field?: "email" | "passwd" }
  | undefined;

export async function loginEmailAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const zobj = z.object({
    email: z.string().email("이메일 형식이 올바르지 않아요."),
    passwd: z.string().min(3, "비밀번호는 3자 이상이에요."),
  });
  // const redirectTo = String(formData.get("redirectTo") ?? "/");

  const [err, data] = validate(zobj, formData);
  if (err) {
    return { ok: false, message: "입력값을 확인해주세요." };
  }

  try {
    const res = await signIn("credentials", { redirect: false, ...data });
    if (res?.error) {
      return {
        ok: false,
        message: "이메일 또는 비밀번호가 올바르지 않아요.",
        field: "email",
      };
    }

    return { ok: true };
  } catch (e) {
    if (e instanceof AuthError) {
      return { ok: false, message: "로그인에 실패했어요. 다시 시도해주세요." };
    }
    return { ok: false, message: "알 수 없는 오류가 발생했어요." };
  }
  // redirect(redirectTo as Route);
}
