import { studentsQuote } from "@Constants/home";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import TestimonialCard from "./TestimonialCard";
import {
  containerAnimationVariant,
  fadeUpVariant,
} from "@Constants/animations";

export default function WhatStudentsSay() {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [visibleCount, setVisibleCount] = useState(1);
  const [stepWidth, setStepWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const [instant, setInstant] = useState(false);

  const GAP_PX = 40; // tailwind gap-10

  // Compute visible columns and exact step width so that N cards + gaps fit viewport width
  useEffect(() => {
    const compute = () => {
      const isXl = window.matchMedia("(min-width: 1280px)").matches;
      const isMd = window.matchMedia("(min-width: 768px)").matches;
      const cols = isXl ? 3 : isMd ? 2 : 1;
      setVisibleCount(cols);

      const viewportWidth = viewportRef.current?.getBoundingClientRect().width || 0;
      const cardWidth = cols > 0 ? (viewportWidth - GAP_PX * (cols - 1)) / cols : 0;
      setStepWidth(cardWidth + GAP_PX);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const extended = useMemo(() => {
    const dup = Math.max(1, visibleCount);
    return [...studentsQuote, ...studentsQuote.slice(0, dup)];
  }, [visibleCount]);

  // Auto-advance by one card
  useEffect(() => {
    if (stepWidth === 0) return;
    const id = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(id);
  }, [stepWidth]);

  // Handle seamless loop reset when reaching the duplicate tail
  useEffect(() => {
    let timeoutId: number | undefined;
    if (index === studentsQuote.length) {
      timeoutId = window.setTimeout(() => {
        setInstant(true);
        setIndex(0);
        // re-enable animation on next tick
        requestAnimationFrame(() => setInstant(false));
      }, 650);
    }
    return () => {
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [index]);

  return (
    <section className="what-students-say naxatw-bg-[#FBF8F3]">
      <div className="naxatw-py-10 md:naxatw-py-20 naxatw-container">
        <p className="naxatw-text-[3rem] naxatw-text-gray-800 naxatw-text-center">
          Our Students
          <span className="naxatw-text-[3rem] naxatw-ml-2 naxatw-text-[#59AAFB]">
            Say !
          </span>
        </p>

        <div ref={viewportRef} className="naxatw-relative naxatw-overflow-hidden naxatw-mt-8">
          <motion.div
            ref={trackRef}
            className="naxatw-flex naxatw-items-stretch naxatw-gap-10"
            animate={{ x: -(index * stepWidth) }}
            transition={instant ? { duration: 0 } : { duration: 0.6, ease: "easeInOut" }}
          >
            {extended.map((card, i) => (
              <motion.div
                key={`${card.id}-${i}`}
                variants={fadeUpVariant}
                className="naxatw-shrink-0"
                style={{ width: `calc((100% - ${GAP_PX * (visibleCount - 1)}px) / ${visibleCount})` }}
              >
                <TestimonialCard {...card} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
