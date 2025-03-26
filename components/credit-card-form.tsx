"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Step1 from "./steps/step1";
import Step2 from "./steps/step2";
import Step3 from "./steps/step3";
import Logo from "./ui/logo";
import { formStrings } from "@/lib/constants";

export default function CreditCardForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    preference: "",
    income: "",
    email: "",
    name: "",
    lastName: "",
    phone: "",
    receiveMessages: false,
  });

  const [lastName, setLastName] = useState(formData.lastName);
  const [phone, setPhone] = useState(formData.phone);

  const totalSteps = 3;
  const progress = Math.round(((step - 1) / (totalSteps - 1)) * 100) || 0;

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  useEffect(() => {
    if (
      step < totalSteps &&
      ((step === 1 && formData.preference) || (step === 2 && formData.income))
    ) {
      const timer = setTimeout(() => setStep(step + 1), 500);
      return () => clearTimeout(timer);
    }
  }, [formData, step]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    console.log("Form submitted with data:", formData);
    window.location.href =
      "https://topfinanzas.com/mx/recomendador-de-tarjetas-de-credito-p1/";
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
    updateFormData({ lastName: e.target.value });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
    updateFormData({ phone: e.target.value });
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
                    handlePhoneChange={handlePhoneChange}
                    lastName={lastName}
                    phone={phone}
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
