"use client";

import type React from "react";

import { motion } from "framer-motion";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { step3Strings } from "@/lib/constants";
import VisitorCounter from "../VisitorCounter";

interface Step3Props {
  formData: {
    email: string;
    name: string;
    lastName: string;
    phone: string;
    receiveMessages: boolean;
  };
  updateFormData: (
    data: Partial<{
      email: string;
      name: string;
      lastName: string;
      phone: string;
      receiveMessages: boolean;
    }>
  ) => void;
  onSubmit: () => void;
  handleLastNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  lastName: string;
  phone: string;
}

export default function Step3({
  formData,
  updateFormData,
  onSubmit,
  handleLastNameChange,
  handlePhoneChange,
  lastName,
  phone,
}: Step3Props) {
  const [email, setEmail] = useState(formData.email);
  const [name, setName] = useState(formData.name);
  const [receiveMessages, setReceiveMessages] = useState(
    formData.receiveMessages
  );

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    updateFormData({ email: e.target.value });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    updateFormData({ name: e.target.value });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setReceiveMessages(checked);
    updateFormData({ receiveMessages: checked });
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-center text-gray-950">
          {step3Strings.title}
        </h2>
        <p className="text-2xl font-bold text-center text-[#2E74B5]">
          Ingresa tus datos y en un instante accederás a la tarjeta de crédito{" "}
          <span className="text-[#4A8BC5]">más adecuada para ti</span>
        </p>
      </div>

      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm">
            {step3Strings.fields.email}
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
            className="h-9 text-sm border-[#2E74B5] focus-visible:ring-[#8DC63F]"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-sm">
            {step3Strings.fields.name}
          </Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={handleNameChange}
            required
            className="h-9 text-sm border-[#2E74B5] focus-visible:ring-[#8DC63F]"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="lastName" className="text-sm">
            Apellido
          </Label>
          <Input
            id="lastName"
            type="text"
            value={lastName}
            onChange={handleLastNameChange}
            required
            className="h-9 text-sm border-[#2E74B5] focus-visible:ring-[#8DC63F]"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-sm">
            Celular
          </Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            required
            className="h-9 text-sm border-[#2E74B5] focus-visible:ring-[#8DC63F]"
          />
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="receiveMessages"
            checked={receiveMessages}
            onCheckedChange={handleCheckboxChange}
            className="mt-0.5 data-[state=checked]:bg-[#8DC63F] data-[state=checked]:border-[#8DC63F]"
          />
          <Label htmlFor="receiveMessages" className="text-xs">
            {step3Strings.checkbox}{" "}
            <a href="#" className="underline">
              acá
            </a>
          </Label>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6"
      >
        <button
          type="button"
          onClick={onSubmit}
          disabled={!receiveMessages}
          className={`w-full py-3 text-sm font-medium rounded-full transition-colors shadow-md ${
            receiveMessages
              ? "bg-[#8DC63F] hover:bg-[#6BA828] text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {step3Strings.button}
        </button>
      </motion.div>

      <div className="mt-8">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-[#2E74B5] text-white px-6 py-2 shadow-md">
            <VisitorCounter />
          </div>
        </div>
        <p className="text-center text-sm">
          <span className="font-bold text-[#FF8C00]">Importante:</span> revisa
          que tu correo esté escrito correctamente para poder enviarte la
          información que deseas
        </p>
        <p className="text-center text-xs mt-2">© Top Networks Inc. 2025</p>
      </div>
    </div>
  );
}
