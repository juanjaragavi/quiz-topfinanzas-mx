"use client";

import type React from "react";

import { motion } from "framer-motion";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { step3Strings, commonStrings } from "@/lib/constants";
import { step3Texts } from "@/lib/strings";
import VisitorCounter from "../VisitorCounter";

interface Step3Props {
  formData: {
    email: string;
    name: string;
    lastName: string;
    receiveMessages: boolean;
  };
  updateFormData: (
    data: Partial<{
      email: string;
      name: string;
      lastName: string;
      receiveMessages: boolean;
    }>
  ) => void;
  onSubmit: (e?: React.FormEvent) => void;
  handleLastNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  lastName: string;
}

export default function Step3({
  formData,
  updateFormData,
  onSubmit,
  handleLastNameChange,
  lastName,
}: Step3Props) {
  const [email, setEmail] = useState(formData.email);
  const [name, setName] = useState(formData.name);
  const [receiveMessages, setReceiveMessages] = useState(
    formData.receiveMessages
  );
  const [errors, setErrors] = useState<{
    email: string | null;
    name: string | null;
    lastName: string | null;
    general: string | null;
  }>({
    email: null,
    name: null,
    lastName: null,
    general: null,
  });

  const validateEmail = (email: string): boolean => {
    if (!email) {
      setErrors((prev) => ({
        ...prev,
        email: step3Texts.validationErrors.emailRequired,
      }));
      return false;
    }

    // Regex para validar el formato básico de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors((prev) => ({
        ...prev,
        email: step3Texts.validationErrors.emailInvalid,
      }));
      return false;
    }

    // Validar dominios comunes en México
    const domainPart = email.split("@")[1]?.toLowerCase();
    if (domainPart) {
      // Validar dominios que parecen incompletos o inválidos
      if (domainPart.split(".").length < 2 || domainPart.endsWith(".")) {
        setErrors((prev) => ({
          ...prev,
          email: step3Texts.validationErrors.emailDomainIncomplete,
        }));
        return false;
      }
    }

    setErrors((prev) => ({ ...prev, email: null }));
    return true;
  };

  const validateName = (name: string): boolean => {
    if (!name.trim()) {
      setErrors((prev) => ({
        ...prev,
        name: step3Texts.validationErrors.nameRequired,
      }));
      return false;
    }

    if (name.trim().length < 2) {
      setErrors((prev) => ({
        ...prev,
        name: step3Texts.validationErrors.nameLength,
      }));
      return false;
    }

    setErrors((prev) => ({ ...prev, name: null }));
    return true;
  };

  const validateLastName = (lastName: string): boolean => {
    if (!lastName.trim()) {
      setErrors((prev) => ({
        ...prev,
        lastName: step3Texts.validationErrors.lastNameRequired,
      }));
      return false;
    }

    if (lastName.trim().length < 2) {
      setErrors((prev) => ({
        ...prev,
        lastName: step3Texts.validationErrors.lastNameLength,
      }));
      return false;
    }

    setErrors((prev) => ({ ...prev, lastName: null }));
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    updateFormData({ email: value });
    if (value.length > 5) {
      validateEmail(value);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    updateFormData({ name: value });
    if (value.length > 0) {
      validateName(value);
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setReceiveMessages(checked);
    updateFormData({ receiveMessages: checked });
  };

  const validateForm = (): boolean => {
    // Validar todos los campos
    const isEmailValid = validateEmail(email);
    const isNameValid = validateName(name);
    const isLastNameValid = validateLastName(lastName);

    // Si no está marcado el checkbox de recibir mensajes
    if (!receiveMessages) {
      setErrors((prev) => ({
        ...prev,
        general: step3Texts.validationErrors.acceptTerms,
      }));
      return false;
    } else {
      setErrors((prev) => ({ ...prev, general: null }));
    }

    return isEmailValid && isNameValid && isLastNameValid && receiveMessages;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar todo el formulario
    if (validateForm()) {
      onSubmit();
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-center text-gray-950">
          {step3Strings.title}
        </h2>
        <p className="text-xl leading-tight font-bold text-center text-[#2E74B5]">
          {step3Texts.subtitle.firstPart}{" "}
          <span className="text-[#4A8BC5]">
            {step3Texts.subtitle.highlight}
          </span>
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
            onBlur={() => validateEmail(email)}
            required
            className={`h-9 text-sm ${
              errors.email
                ? "border-red-500 focus-visible:ring-red-500"
                : "border-[#2E74B5] focus-visible:ring-[#8DC63F]"
            }`}
            placeholder="ejemplo@correo.com"
            aria-describedby="email-error"
          />
          {errors.email && (
            <p id="email-error" className="text-xs text-red-500 mt-1">
              {errors.email}
            </p>
          )}
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
            onBlur={() => validateName(name)}
            required
            className={`h-9 text-sm ${
              errors.name
                ? "border-red-500 focus-visible:ring-red-500"
                : "border-[#2E74B5] focus-visible:ring-[#8DC63F]"
            }`}
            placeholder="Tu nombre"
            aria-describedby="name-error"
          />
          {errors.name && (
            <p id="name-error" className="text-xs text-red-500 mt-1">
              {errors.name}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="lastName" className="text-sm">
            Apellido
          </Label>
          <Input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => {
              handleLastNameChange(e);
              if (lastName.length > 0) {
                validateLastName(e.target.value);
              }
            }}
            onBlur={() => validateLastName(lastName)}
            required
            className={`h-9 text-sm ${
              errors.lastName
                ? "border-red-500 focus-visible:ring-red-500"
                : "border-[#2E74B5] focus-visible:ring-[#8DC63F]"
            }`}
            placeholder="Tu apellido"
            aria-describedby="lastName-error"
          />
          {errors.lastName && (
            <p id="lastName-error" className="text-xs text-red-500 mt-1">
              {errors.lastName}
            </p>
          )}
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
            <a
              href="https://topfinanzas.com/mx/politica-privacidad"
              className="underline"
            >
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
        {errors.general && (
          <p className="text-xs text-red-500 mt-2 text-center">
            {errors.general}
          </p>
        )}

        <button
          type="button"
          onClick={handleFormSubmit}
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
          <div className="">
            <VisitorCounter />
          </div>
        </div>
        <p className="text-center text-sm">
          <span className="font-bold text-[#FF8C00]">
            {commonStrings.important.prefix}
          </span>{" "}
          {commonStrings.important.emailVerification}
        </p>
        <p className="text-center text-xs mt-2">{commonStrings.copyright}</p>
      </div>
    </div>
  );
}
