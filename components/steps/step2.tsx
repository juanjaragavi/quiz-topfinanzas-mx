"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import OptionButton from "../ui/option-button"
import { step2Strings } from "@/lib/strings"

interface Step2Props {
  formData: {
    income: string
  }
  updateFormData: (data: { income: string }) => void
}

export default function Step2({ formData, updateFormData }: Step2Props) {
  const [selected, setSelected] = useState(formData.income)

  const options = step2Strings.options

  const handleSelect = (id: string) => {
    setSelected(id)
    updateFormData({ income: id })
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="bg-[#B8E986] text-[#2E74B5] rounded-full py-1 px-3 inline-block mb-1 text-xs">{step2Strings.progress}</div>
        <h2 className="text-base font-medium">{step2Strings.title}</h2>
      </div>

      <motion.h1
        className="text-xl font-bold text-center text-[#2E74B5]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {step2Strings.question}
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
