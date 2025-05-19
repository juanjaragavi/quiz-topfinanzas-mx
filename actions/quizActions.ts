"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const THIRTY_DAYS_IN_SECONDS = 30 * 24 * 60 * 60;

interface FormData {
  preference: string;
  income: string;
  email: string;
  name: string;
  lastName: string;
  receiveMessages: boolean;
}

export async function submitQuiz1(formData: FormData) {
  console.log("Quiz 1 submitted with data:", formData);

  const cookieStore = await cookies();
  cookieStore.set("quiz1_completed", "true", {
    path: "/",
    maxAge: THIRTY_DAYS_IN_SECONDS,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "lax",
  });

  redirect(
    "https://topfinanzas.com/mx/encuentra-tu-solucion-financiera-ideal-1/"
  );
}

export async function submitQuiz2(formData: FormData) {
  console.log("Quiz 2 submitted with data:", formData);

  const cookieStore = await cookies();
  cookieStore.set("quiz2_completed", "true", {
    path: "/",
    maxAge: THIRTY_DAYS_IN_SECONDS,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "lax",
  });

  redirect(
    "https://topfinanzas.com/mx/soluciones-financieras/guia-tarjeta-de-credito-nu-bank/"
  );
}
