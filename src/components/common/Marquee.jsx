// src/components/common/Marquee.jsx
import React from "react";
import { GoNorthStar } from "react-icons/go";

const defaultItems = [
  "React",
  "TypeScript",
  "Node.js",
  "Tailwind",
  "Next.js",
  "Vite",
  "Figma",
  "MongoDB",
  "Express",
  "Vercel",
];

function Marquee({ items = defaultItems }) {
  return (
    <div className="relative w-full border-y border-[color:var(--color-line)] bg-white py-5 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="mx-8 font-display text-xl sm:text-2xl tracking-tight text-[color:var(--color-ink)]/80 flex items-center gap-8"
          >
            {item}
            <GoNorthStar
              aria-hidden="true"
              className="text-[color:var(--color-accent)] text-sm"
            />
          </span>
        ))}
      </div>
    </div>
  );
}

export default Marquee;
