import CreditCardFormQ2 from "@/components/credit-card-form-q2";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { UTM_PARAMS } from "@/lib/constants"; // Import UTM_PARAMS
import {
  storeUTMParamsInCookies,
  appendUTMParamsToUrl,
} from "@/lib/utm-cookie-manager";

const EXCLUDED_IPS = ["181.50.163.211"];

interface PageProps {
  searchParams?:
    | Promise<{ [key: string]: string | string[] | undefined }>
    | { [key: string]: string | string[] | undefined };
}

export default async function HomeQ2({ searchParams }: PageProps) {
  try {
    // Handle searchParams safely
    let params: { [key: string]: string | string[] | undefined } = {};

    if (searchParams) {
      // Check if searchParams is a Promise and await it
      if (searchParams instanceof Promise) {
        params = await searchParams;
      } else {
        params = searchParams;
      }
    }

    // Store UTM parameters in cookies if they exist in the URL
    const urlSearchParams = new URLSearchParams();

    if (params && typeof params === "object") {
      Object.entries(params).forEach(([key, value]) => {
        if (UTM_PARAMS.includes(key) && typeof value === "string") {
          urlSearchParams.set(key, value);
        }
      });
    }

    if (urlSearchParams.toString()) {
      try {
        await storeUTMParamsInCookies(urlSearchParams);
        console.log(
          "[app/q2/page.tsx] Stored UTM parameters in cookies:",
          urlSearchParams.toString()
        );
      } catch (error) {
        console.error("[app/q2/page.tsx] Error storing UTM parameters:", error);
      }
    }
  } catch (error) {
    console.error("[app/q2/page.tsx] Error processing search params:", error);
  }

  const cookieStore = await cookies();
  const quiz2Completed = cookieStore.get("quiz2_completed");

  const headersList = await headers();
  const xForwardedFor = headersList.get("x-forwarded-for");
  let userIp = "";

  if (xForwardedFor) {
    userIp = xForwardedFor.split(",")[0].trim();
  } else {
    const xRealIp = headersList.get("x-real-ip");
    if (xRealIp) {
      userIp = xRealIp.trim();
    }
    // If still no IP, it might be a direct local connection or an environment where these headers are not set.
    // For testing, you might want to log this or handle it specifically.
    // console.log("User IP could not be determined from x-forwarded-for or x-real-ip. Headers:", Object.fromEntries(headersList.entries()));
  }

  const isExcludedIp = EXCLUDED_IPS.includes(userIp);

  if (!isExcludedIp && quiz2Completed?.value === "true") {
    // Use the appendUTMParamsToUrl utility for consistency
    const baseUrl =
      "https://topfinanzas.com/mx/soluciones-financieras/guia-tarjeta-de-credito-nu-bank/";
    const finalUrl = await appendUTMParamsToUrl(baseUrl);

    console.log(
      "[app/q2/page.tsx] Registered user redirect URL with UTM params:",
      finalUrl
    );
    redirect(finalUrl);
  }

  return (
    <main className="flex min-h-[100dvh] flex-col justify-start bg-gray-100 pb-safe">
      <section className="w-full p-0">
        <CreditCardFormQ2 />
      </section>
    </main>
  );
}
