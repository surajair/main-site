"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";

type ResizeHandleComponentProps = {
  phrases: string[];
  duration?: number;
  blockProps: React.HTMLAttributes<HTMLDivElement>;
  styles: any;
  borderStyles: any;
};

const SelectionHandle = ({ position }: { position: string }) => {
  return (
    <div
      className={`absolute w-4 h-4 bg-white dark:bg-gray-800 border-2 border-blue-500 dark:border-blue-400 rounded-sm ${position}`}
    ></div>
  );
};

const FlipWordsInline = ({
  words,
  duration = 3000,
}: {
  words: string[];
  duration?: number;
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
    <div className="inline-block align-middle overflow-hidden h-[1.2em] leading-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentWord}
          variants={wordContainerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="inline-block whitespace-nowrap"
        >
          {currentWord.split("").map((char, i) => (
            <motion.span
              key={`${char}-${i}`}
              variants={letterVariants}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const ResizeHandleComponent = ({
  phrases,
  duration = 3000,
  blockProps,
  styles,
  borderStyles,
}: ResizeHandleComponentProps) => {
  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Phudu:wght@700&display=swap');
          .font-phudu {
            font-family: 'Phudu', cursive;
          }
        `}
      </style>
      <div
        {...blockProps}
        {...styles}
        className={`${styles?.className || ""} flex flex-col items-center justify-center font-sans p-4 text-center overflow-hidden`}
        style={{
          ...styles?.style,
        }}
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="relative inline-block my-2"
        >
          <div className="font-phudu font-bold tracking-tight  py-1 px-4 flex items-center justify-center uppercase relative">
            <FlipWordsInline words={phrases} duration={duration} />
          </div>

          <div className={`absolute inset-0 ${borderStyles?.className || ""} pointer-events-none`} style={{ ...borderStyles?.style }}></div>

          <SelectionHandle position="-top-2 -left-2" />
          <SelectionHandle position="-top-2 -right-2" />
          <SelectionHandle position="-bottom-2 -left-2" />
          <SelectionHandle position="-bottom-2 -right-2" />
        </motion.div>
      </div>
    </>
  );
};

export default ResizeHandleComponent;
