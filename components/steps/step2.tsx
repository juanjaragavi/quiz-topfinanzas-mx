"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import OptionButton from "../ui/option-button"

interface Step2Props {
  formData: {
    income: string
  }
  updateFormData: (data: { income: string }) => void
}

export default function Step2({ formData, updateFormData }: Step2Props) {
  const [selected, setSelected] = useState(formData.income)

  const options = [
    { id: "A", label: "Less than $2,500 USD" },
    { id: "B", label: "Between $2,500 and $5,000" },
    { id: "C", label: "Between $5,000 and $10,000" },
    { id: "D", label: "Between $10,000 and $15,000" },
    { id: "E", label: "Between $15,000 and $20,000" },
    { id: "F", label: "More than $20,000" },
  ]

  const handleSelect = (id: string) => {
    setSelected(id)
    updateFormData({ income: id })
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="bg-[#B8E986] text-[#2E74B5] rounded-full py-1 px-3 inline-block mb-1 text-xs">2 / 2</div>
        <h2 className="text-base font-medium">Find your credit card</h2>
      </div>

      <motion.h1
        className="text-xl font-bold text-center text-[#2E74B5]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        What is your monthly income?
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

