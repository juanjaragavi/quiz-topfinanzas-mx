"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Step1 from "./steps/step1";
import Step2 from "./steps/step2";
import Step3 from "./steps/step3";
import Logo from "./ui/logo";
import { formStrings } from "@/lib/constants";
import {
  submitQuiz2,
  redirectToFinalQuiz2Destination,
} from "@/actions/quizActions";

interface CreditCardFormQ2Props {
  isRegistered: boolean;
}

export default function CreditCardFormQ2({
  isRegistered,
}: CreditCardFormQ2Props) {
  console.log("[CreditCardFormQ2] Received isRegistered prop:", isRegistered);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    preference: "",
    income: "",
    email: "",
    name: "",
    lastName: "",
    receiveMessages: false,
  });

  const [lastName, setLastName] = useState(formData.lastName);

  const totalSteps = 3;
  const progress = Math.round(((step - 1) / (totalSteps - 1)) * 100) || 0;

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  useEffect(() => {
    console.log(
      `[CreditCardFormQ2 useEffect] Step: ${step}, Preference: ${formData.preference}, Income: ${formData.income}, isRegistered: ${isRegistered}`
    );
    if (step === 1 && formData.preference) {
      console.log(
        "[CreditCardFormQ2 useEffect] Advancing from Step 1 to Step 2"
      );
      // Auto-advance from Step 1 to Step 2
      const timer = setTimeout(() => setStep(2), 500);
      return () => clearTimeout(timer);
    } else if (step === 2 && formData.income) {
      console.log("[CreditCardFormQ2 useEffect] Completed Step 2");
      // Completed Step 2
      if (isRegistered) {
        console.log(
          "[CreditCardFormQ2 useEffect] User is registered. Attempting redirect."
        );
        // If registered, bypass Step 3 and redirect
        const performRedirect = async () => {
          try {
            await redirectToFinalQuiz2Destination();
            // Redirect will be handled by the server action
            console.log(
              "[CreditCardFormQ2 useEffect] Redirect action called for registered user."
            );
          } catch (error) {
            console.error("Failed to redirect registered user:", error);
            // Optionally, handle UI error state here
            // As a fallback, could proceed to step 3, but task implies skipping.
            // For now, log error and user stays on step 2 if redirect fails.
          }
        };
        performRedirect();
      } else {
        console.log(
          "[CreditCardFormQ2 useEffect] User not registered. Advancing to Step 3."
        );
        // If not registered, proceed to Step 3
        const timer = setTimeout(() => setStep(3), 500);
        return () => clearTimeout(timer);
      }
    }
  }, [formData.preference, formData.income, step, isRegistered, totalSteps]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    // console.log("Form submitted with data:", formData); // Server action will log this
    // window.location.href =
    //   "https://topfinanzas.com/mx/soluciones-financieras/guia-tarjeta-de-credito-nu-bank/";
    try {
      await submitQuiz2(formData);
      // Redirect will be handled by the server action
    } catch (error) {
      console.error("Failed to submit quiz 2:", error);
      // Handle error appropriately in the UI if needed
    }
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
    updateFormData({ lastName: e.target.value });
  };

  return (
    <div className="bg-white flex flex-col h-[100dvh]">
      <div className="bg-[#2E74B5] py-3 px-4 flex justify-center -mb-8 flex-none">
        <Logo />
      </div>

      <div className="relative flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="px-4 pt-10 pb-20"
          >
            <form onSubmit={(e) => step === totalSteps && handleSubmit(e)}>
              {step === 1 && (
                <Step1 formData={formData} updateFormData={updateFormData} />
              )}
              {step === 2 && (
                <Step2 formData={formData} updateFormData={updateFormData} />
              )}
              {step === 3 && (
                <>
                  <Step3
                    formData={formData}
                    updateFormData={updateFormData}
                    onSubmit={handleSubmit}
                    handleLastNameChange={handleLastNameChange}
                    lastName={lastName}
                  />
                </>
              )}
            </form>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-4 flex-none bg-white border-t shadow-lg">
        <div className="w-full space-y-3 mt-2">
          <div className="space-y-2">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#8DC63F] to-[#2E74B5]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <div className="text-center text-sm text-gray-600">
              {progress}
              {formStrings.progressBar.complete}
              {progress < 100
                ? formStrings.progressBar.keepItUp
                : formStrings.progressBar.completed}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
