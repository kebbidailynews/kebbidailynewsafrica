// components/Ticker.tsx
"use client";
import { useState, useEffect } from "react";

const BREAKING = [
  "BREAKING: Bandits attack Zuru – 12 feared dead",
  "Governor Idris approves ₦2B for flood victims",
  "Kebbi cement plant deal signed with Chinese firm",
  "NEMA delivers 5,000 bags of rice to Argungu",
];

export default function Ticker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % BREAKING.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-red-700 text-white py-1 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {BREAKING.concat(BREAKING).map((item, i) => (
          <span key={i} className="mx-8 font-semibold">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}