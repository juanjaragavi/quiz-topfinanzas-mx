"use client"

import { motion } from "framer-motion"

interface ProgressBarProps {
  progress: number
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="p-0 m-0 grid justify-center items-center">
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#8DC63F] to-[#2E74B5]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <div className="text-center text-sm text-gray-600">
        {progress}% complete{progress < 100 ? ", keep it up!" : "!"}
      </div>
    </div>
  )
}

