"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export default function Logo() {
  return (
    <motion.div
      className="relative h-16 w-16 bg-white rounded-full p-2 border-2 border-[#8DC63F] flex items-center justify-center"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.3,
      }}
    >
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Imagotipo-sinfondo-3-gEahRjTETkuvBtblSOs8dgdFVGFmuo.png"
        alt="Top Finance Logo"
        width={48}
        height={48}
        className="object-contain"
      />
    </motion.div>
  )
}

