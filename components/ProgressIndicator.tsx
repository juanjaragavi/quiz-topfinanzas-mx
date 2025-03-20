"use client";

export default function ProgressIndicator({ step }: { step: number }) {
  return (
    <div className="flex justify-center space-x-2 mb-4">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
          step === 1 ? "bg-[#2E74B5]" : "bg-gray-300"
        }`}
      >
        1
      </div>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
          step === 2 ? "bg-[#2E74B5]" : "bg-gray-300"
        }`}
      >
        2
      </div>
    </div>
  );
}
