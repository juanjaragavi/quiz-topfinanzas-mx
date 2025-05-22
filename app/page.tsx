import CreditCardForm from "@/components/credit-card-form";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

const EXCLUDED_IPS = ["179.33.232.2", "181.50.163.211"];

export default async function Home() {
  const cookieStore = await cookies();
  const quiz1Completed = cookieStore.get("quiz1_completed");

  const headersList = await headers(); // Await the headers() promise
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

  if (!isExcludedIp && quiz1Completed?.value === "true") {
    redirect(
      "https://topfinanzas.com/mx/encuentra-tu-solucion-financiera-ideal-1/?utm_source=adwords&utm_campaign=22589599879&utm_content=178590506134&utm_medium=cpc"
    );
  }

  return (
    <main className="flex min-h-[100dvh] flex-col justify-start bg-gray-100 pb-safe">
      <section className="w-full p-0">
        <CreditCardForm />
      </section>
    </main>
  );
}
