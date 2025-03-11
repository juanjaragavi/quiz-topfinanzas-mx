import CreditCardForm from "@/components/credit-card-form"

export default function Home() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-start bg-gray-100 pb-safe">
      <section className="w-full max-w-md p-4 md:py-8">
        <CreditCardForm />
      </section>
    </main>
  )
}

