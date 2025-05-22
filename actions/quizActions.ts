"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { appendUTMParamsToUrl } from "@/lib/utm-cookie-manager";

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

  // Append UTM parameters from cookies to the redirect URL
  const baseUrl =
    "https://topfinanzas.com/mx/encuentra-tu-solucion-financiera-ideal-1/";
  const finalUrl = await appendUTMParamsToUrl(baseUrl);

  console.log("Quiz 1 redirect URL with UTM params:", finalUrl);
  redirect(finalUrl);
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

  // Append UTM parameters from cookies to the redirect URL
  const baseUrl =
    "https://topfinanzas.com/mx/soluciones-financieras/guia-tarjeta-de-credito-nu-bank/";
  const finalUrl = await appendUTMParamsToUrl(baseUrl);

  console.log("Quiz 2 redirect URL with UTM params:", finalUrl);
  redirect(finalUrl);
}

export async function redirectToFinalQuiz1Destination() {
  // This action redirects a user who is already registered and has completed steps 1 and 2.
  // It mirrors the redirection logic that was previously in app/page.tsx,
  // including UTM parameter handling from cookies.

  // Use the appendUTMParamsToUrl utility for consistency
  const baseUrl =
    "https://topfinanzas.com/mx/encuentra-tu-solucion-financiera-ideal-1/";
  const finalUrl = await appendUTMParamsToUrl(baseUrl);

  console.log("Registered user redirect URL with UTM params:", finalUrl);
  redirect(finalUrl);
}
