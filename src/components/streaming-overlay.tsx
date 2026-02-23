"use client";

import { motion, AnimatePresence } from "framer-motion";

interface StreamingOverlayProps {
  visible: boolean;
}

export function StreamingOverlay({ visible }: StreamingOverlayProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95"
        >
          <div className="flex gap-3 mb-6">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full bg-accent"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
          <p className="font-serif text-muted italic text-lg">
            Channeling your words...
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
