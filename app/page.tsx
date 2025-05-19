import CreditCardForm from "@/components/credit-card-form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies();
  const quiz1Completed = cookieStore.get("quiz1_completed");

  if (quiz1Completed?.value === "true") {
    redirect(
      "https://topfinanzas.com/mx/encuentra-tu-solucion-financiera-ideal-1/"
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
