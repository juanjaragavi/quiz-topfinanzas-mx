import CreditCardFormQ2 from "@/components/credit-card-form-q2";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomeQ2() {
  const cookieStore = await cookies();
  const quiz2Completed = cookieStore.get("quiz2_completed");

  if (quiz2Completed?.value === "true") {
    redirect(
      "https://topfinanzas.com/mx/soluciones-financieras/guia-tarjeta-de-credito-nu-bank/"
    );
  }

  return (
    <main className="flex min-h-[100dvh] flex-col justify-start bg-gray-100 pb-safe">
      <section className="w-full p-0">
        <CreditCardFormQ2 />
      </section>
    </main>
  );
}
