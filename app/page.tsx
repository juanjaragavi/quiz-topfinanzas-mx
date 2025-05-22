import CreditCardForm from "@/components/credit-card-form";
import { cookies, headers } from "next/headers";
// Removed 'redirect' from "next/navigation" as it's no longer used directly here for quiz completion
import { UTM_PARAMS } from "@/lib/constants"; // Import UTM_PARAMS

const EXCLUDED_IPS = ["179.33.232.2", "181.50.163.211"];

export default async function Home() {
  const cookieStore = await cookies();
  const quiz1Completed = cookieStore.get("quiz1_completed");

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
    // console.log("User IP could not be determined from x-forwarded-for or x-real-ip. Headers:", Object.fromEntries(headersList.entries()));
  }

  const isExcludedIp = EXCLUDED_IPS.includes(userIp);

  // Determine if the user is considered "registered" for the purpose of the quiz flow
  // A user is registered if their quiz is marked completed AND they are not on an excluded IP list.
  const isRegisteredUser = !isExcludedIp && quiz1Completed?.value === "true";

  console.log(
    `[app/page.tsx] User IP: ${userIp}, Is Excluded: ${isExcludedIp}, Quiz1 Completed Cookie: ${quiz1Completed?.value}, Calculated isRegisteredUser: ${isRegisteredUser}`
  );

  // The immediate redirect based on quiz1Completed is removed from here.
  // This logic will now be handled within CreditCardForm or by actions it calls.
  // The old redirect logic:
  // if (isRegisteredUser) {
  //   const baseRedirectUrl =
  //     "https://topfinanzas.com/mx/encuentra-tu-solucion-financiera-ideal-1/";
  //   const redirectUrlParams = new URLSearchParams();
  //
  //   UTM_PARAMS.forEach((param) => {
  //     const cookie = cookieStore.get(param);
  //     if (cookie && cookie.value) {
  //       redirectUrlParams.set(param, cookie.value);
  //     }
  //   });
  //
  //   let finalRedirectUrl = baseRedirectUrl;
  //   if (redirectUrlParams.toString()) {
  //     finalRedirectUrl += `?${redirectUrlParams.toString()}`;
  //   }
  //   redirect(finalRedirectUrl); // This redirect is removed
  // }

  return (
    <main className="flex min-h-[100dvh] flex-col justify-start bg-gray-100 pb-safe">
      <section className="w-full p-0">
        <CreditCardForm isRegistered={isRegisteredUser} />
      </section>
    </main>
  );
}
