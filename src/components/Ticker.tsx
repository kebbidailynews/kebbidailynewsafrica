// components/Ticker.tsx
"use client";
import { useEffect, useState } from "react";

const TICKER_ITEMS = [
  "Governor signs historic education bill pledging ₦4B for schools statewide",
  "Security forces neutralize bandits in Argungu — Army confirms 12 casualties",
  "Kebbi records lowest unemployment rate in 5 years, Commissioner says",
  "New 200-bed hospital commissioned in Birnin Kebbi by Deputy Governor",
  "Farmers receive ₦2B agricultural support package ahead of rainy season",
  "Kebbi FC qualifies for national league playoff final — Governor congratulates team",
];

export default function Ticker() {
  const [visible, setVisible] = useState(true);

  return (
    <div className={`bg-[#0A0A0A] border-b border-gray-800 overflow-hidden transition-all ${visible ? "h-9" : "h-0"}`}>
      <div className="flex items-center h-full">
        {/* Label */}
        <div className="flex-shrink-0 bg-[#CC0000] text-white text-[10px] font-black px-4 h-full flex items-center tracking-[2px] uppercase">
          BREAKING
        </div>

        {/* Scrolling text */}
        <div className="flex-1 overflow-hidden relative h-full flex items-center">
          <div className="flex gap-16 animate-ticker whitespace-nowrap text-gray-300 text-xs font-semibold tracking-wide">
            {/* Duplicate for seamless loop */}
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="flex items-center gap-3">
                <span className="text-[#CC0000] font-black">•</span>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Dismiss */}
        <button
          onClick={() => setVisible(false)}
          className="flex-shrink-0 px-3 text-gray-600 hover:text-gray-400 text-lg leading-none"
          aria-label="Close ticker"
        >
          ×
        </button>
      </div>
    </div>
  );
}