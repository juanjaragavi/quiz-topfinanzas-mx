"use client";

import { useState, useEffect } from "react";

export default function VisitorCounter() {
  const [count, setCount] = useState(283);

  useEffect(() => {
    setCount((prevCount) => prevCount + 1);
  }, []);

  return (
    <span className="text-xs">
      <span className="font-bold">{count}</span> solicitudes exitosas hoy
    </span>
  );
}
