import CreditCardFormQ2 from "@/components/credit-card-form-q2";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { UTM_PARAMS } from "@/lib/constants"; // Import UTM_PARAMS
import {
  storeUTMParamsInCookies,
  appendUTMParamsToUrl,
} from "@/lib/utm-cookie-manager";

const EXCLUDED_IPS = ["181.50.163.211"];

export default async function HomeQ2({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Store UTM parameters in cookies if they exist in the URL
  const urlSearchParams = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (UTM_PARAMS.includes(key) && typeof value === "string") {
      urlSearchParams.set(key, value);
    }
  });

  if (urlSearchParams.toString()) {
    await storeUTMParamsInCookies(urlSearchParams);
    console.log(
      "[app/q2/page.tsx] Stored UTM parameters in cookies:",
      urlSearchParams.toString()
    );
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
