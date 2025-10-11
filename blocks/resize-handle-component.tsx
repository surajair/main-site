"use client";

import { cn } from "@/lib/utils";
import { ChaiStyles } from "chai-next/blocks";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";

type ResizeHandleComponentProps = {
  words: string[];
  duration?: number;
  blockProps: React.HTMLAttributes<HTMLDivElement>;
  borderStyles: ChaiStyles;
  handleStyles: ChaiStyles;
  containerStyles: ChaiStyles;
  wordStyles: ChaiStyles;
};

const SelectionHandle = ({ position, handleStyles }: { position: string; handleStyles?: ChaiStyles }) => {
  return <div className={cn(`absolute ${position}`, handleStyles?.className)}></div>;
};

const FlipWordsInline = ({
  words,
  duration = 3000,
  wordStyles,
}: {
  words: string[];
  duration?: number;
  wordStyles?: ChaiStyles;
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    return () => clearInterval(intervalId);
  }, [words, duration]);

  const wordContainerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
    exit: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const letterVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 10,
      filter: "blur(8px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "tween" as const,
        ease: [0.25, 0.1, 0.25, 1],
        duration: 0.4,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      filter: "blur(8px)",
      transition: {
        type: "tween" as const,
        ease: [0.4, 0, 0.6, 1],
        duration: 0.4,
      },
    },
  };

  const currentWord = words[index];

  return (
    <div className="inline-block align-middle overflow-hidden h-fit leading-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentWord}
          variants={wordContainerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          {...wordStyles}>
          {currentWord.split("").map((char, i) => (
            <motion.span key={`${char}-${i}`} variants={letterVariants} className="inline-block">
              {char}
            </motion.span>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const ResizeHandleComponent = ({
  words,
  duration = 3000,
  blockProps,
  borderStyles,
  handleStyles,
  containerStyles,
  wordStyles,
}: ResizeHandleComponentProps) => {
  return (
    <>
      <span {...blockProps} {...containerStyles}>
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="relative inline-block my-2">
          <div className="tracking-tight  py-1 px-4 flex items-center justify-center uppercase relative">
            <FlipWordsInline words={words} duration={duration} wordStyles={wordStyles} />
          </div>

          <div className={`absolute inset-0 ${borderStyles?.className || ""} pointer-events-none`} />
          <SelectionHandle position="-top-2 -left-2" handleStyles={handleStyles} />
          <SelectionHandle position="-top-2 -right-2" handleStyles={handleStyles} />
          <SelectionHandle position="-bottom-2 -left-2" handleStyles={handleStyles} />
          <SelectionHandle position="-bottom-2 -right-2" handleStyles={handleStyles} />
        </motion.div>
      </span>
    </>
  );
};

export default ResizeHandleComponent;
