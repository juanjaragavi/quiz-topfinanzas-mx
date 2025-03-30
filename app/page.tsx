import CreditCardForm from "@/components/credit-card-form"

export default function Home() {
  return (
    <main className="flex min-h-[100dvh] flex-col justify-start bg-gray-100 pb-safe">
      <section className="w-full p-0">
        <CreditCardForm />
      </section>
    </main>
  )
}
