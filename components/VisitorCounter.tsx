"use client";

import { useState, useEffect } from "react";

export default function VisitorCounter() {
  const [count, setCount] = useState(283);

  useEffect(() => {
    setCount((prevCount) => prevCount + 1);
  }, []);

  return (
    <span className="text-xs bg-transparent shadow-none">
      <span className="font-bold text-[#4A8BC5]">{count}</span>
      <span className="text-black"> solicitudes exitosas hoy</span>
    </span>
  );
}
