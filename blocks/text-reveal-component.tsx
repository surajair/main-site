"use client";

import { motion } from "framer-motion";

type TextRevealComponentProps = {
  text: string;
  duration: number;
  staggerDelay: number;
  blockProps: React.HTMLAttributes<HTMLDivElement>;
  styles: any;
};

const TextRevealComponent = ({ text, duration, staggerDelay, blockProps, styles }: TextRevealComponentProps) => {
  const words = text.split(" ");

  const durationInSeconds = duration / 1000;
  const staggerDelayInSeconds = staggerDelay / 1000;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelayInSeconds,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      filter: "blur(10px)",
      y: 20,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        duration: durationInSeconds,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
  };
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      {...blockProps}
      {...styles}
      className={`${styles?.className || ""} flex flex-wrap max-w-full`}>
      {words.map((word, index) => (
        <motion.span key={`${word}-${index}`} variants={wordVariants} className="inline-block mr-2">
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default TextRevealComponent;
