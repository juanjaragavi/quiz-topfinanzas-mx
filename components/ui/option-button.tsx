"use client";

import { motion } from "framer-motion";

interface OptionButtonProps {
  id: string;
  label: string;
  selected: boolean;
  onClick: () => void;
  delay?: number;
}

export default function OptionButton({
  id,
  label,
  selected,
  onClick,
  delay = 0,
}: OptionButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`option-button flex items-center w-full rounded-full overflow-hidden mb-2 ${
        selected
          ? "selected bg-[#6fade7] text-[#8DC63F]"
          : "bg-[#296eb0]/80 text-white hover:bg-opacity-90"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className={`circle flex items-center justify-center h-10 w-10 rounded-full text-sm ${
          selected ? "bg-[#8DC63F] text-white" : "bg-white text-[#6fade7]"
        }`}
      >
        {id}
      </div>
      <div className="p-3 font-medium text-sm flex-grow">{label}</div>
    </motion.button>
  );
}
