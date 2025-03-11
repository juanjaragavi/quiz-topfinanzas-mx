"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import OptionButton from "../ui/option-button"

interface Step1Props {
  formData: {
    preference: string
  }
  updateFormData: (data: { preference: string }) => void
}

export default function Step1({ formData, updateFormData }: Step1Props) {
  const [selected, setSelected] = useState(formData.preference)

  const options = [
    { id: "A", label: "High credit limit" },
    { id: "B", label: "Instant approval" },
    { id: "C", label: "No credit check required" },
    { id: "D", label: "No annual fee" },
    { id: "E", label: "Cashback rewards" },
    { id: "F", label: "Low or 0% APR" },
  ]

  const handleSelect = (id: string) => {
    setSelected(id)
    updateFormData({ preference: id })
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="bg-[#B8E986] text-[#2E74B5] rounded-full py-1 px-3 inline-block mb-1 text-xs">1 / 2</div>
        <h2 className="text-base font-medium">Find your credit card</h2>
      </div>

      <motion.h1
        className="text-xl font-bold text-center text-[#2E74B5]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        What matters most to you when choosing a credit card?
      </motion.h1>

      <motion.div
        className="space-y-2 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, staggerChildren: 0.1 }}
      >
        {options.map((option, index) => (
          <OptionButton
            key={option.id}
            id={option.id}
            label={option.label}
            selected={selected === option.id}
            onClick={() => handleSelect(option.id)}
            delay={0.1 * index}
          />
        ))}
      </motion.div>
    </div>
  )
}

