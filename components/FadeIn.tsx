"use client";

import { motion, MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

// Traavellio Framer-style smooth reveal animation
export default function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{
          duration: 0.65,
          ease: [0.21, 0.47, 0.32, 0.98],
          delay,
        }}
        className={className}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
