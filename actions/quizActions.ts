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

export async function redirectToFinalQuiz1Destination() {
  // This action redirects a user who is already registered and has completed steps 1 and 2.
  // It mirrors the redirection logic that was previously in app/page.tsx,
  // including UTM parameter handling from cookies.

  const cookieStore = await cookies();
  // Dynamically import UTM_PARAMS to avoid potential issues with direct import in server actions
  // if constants.ts has client-side specific code or assumptions.
  // However, given lib/constants.ts is likely just constants, direct import is usually fine.
  // For robustness or if issues arise, dynamic import is an option:
  // const { UTM_PARAMS } = await import("@/lib/constants");
  // Assuming direct import is fine based on typical usage of a constants file:
  const { UTM_PARAMS } = await import("@/lib/constants");

  const baseRedirectUrl =
    "https://topfinanzas.com/mx/encuentra-tu-solucion-financiera-ideal-1/";
  const redirectUrlParams = new URLSearchParams();

  UTM_PARAMS.forEach((param: string) => {
    const cookie = cookieStore.get(param);
    if (cookie && cookie.value) {
      redirectUrlParams.set(param, cookie.value);
    }
  });

  let finalRedirectUrl = baseRedirectUrl;
  if (redirectUrlParams.toString()) {
    finalRedirectUrl += `?${redirectUrlParams.toString()}`;
  }
  redirect(finalRedirectUrl);
}
