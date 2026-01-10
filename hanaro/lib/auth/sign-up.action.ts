"use server";

import { redirect } from "next/navigation";
import z from "zod";
import { isErrorWithMessage } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import {
  encryptPassword,
  saveProfile,
  type ValidError,
  validate,
} from "@/lib/validator";

export const regist = async (
  _: ValidError | undefined,
  formData: FormData,
): Promise<ValidError | undefined> => {
  const imageFile = await saveProfile(formData.get("image") as File);
  formData.set("image", imageFile || "");

  const zobj = z
    .object({
      name: z.string().min(1, "Input the name!").max(30),
      email: z.email(),
      passwd: z.string().min(3),
      passwd2: z.string().min(3),
      image: z.nullable(z.string()),
    })
    .refine(({ passwd, passwd2 }) => passwd === passwd2, {
      path: ["passwd2"],
      message: "Not equals the passwd and passwd2!",
    });

  const [err, data] = validate(zobj, formData);
  if (err) return err;

  const { email, name, image } = data;

  try {
    const exists = await prisma.user.findUnique({ where: { email } });

    if (exists) {
      return {
        error: { email: "This email is already exists!" },
        data,
      };
    }

    const passwd = await encryptPassword(data.passwd);

    await prisma.user.create({
      data: { email, name, passwd, image },
      select: { id: true, name: true, email: true, isadmin: true },
    });

    redirect("/auth/sign-in");
  } catch (err) {
    let message = JSON.stringify(err);
    if (isErrorWithMessage(err)) {
      if (err.message === "NEXT_REDIRECT") redirect("/auth/sign-in");
      message = err.message;
    }
    return { error: { email: message }, data };
  }
};
