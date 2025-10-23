"use client";

import { Play, XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { ChaiStyles } from "chai-next/blocks";

type AnimationStyle =
  | "from-bottom"
  | "from-center"
  | "from-top"
  | "from-left"
  | "from-right"
  | "fade"
  | "top-in-bottom-out"
  | "left-in-right-out";

interface HeroVideoProps {
  animationStyle?: AnimationStyle;
  videoSrc: string;
  thumbnailSrc: string;
  thumbnailAlt: string;
  styles: ChaiStyles;
  blockProps: Record<string, string>;
  inBuilder: boolean;
}

const animationVariants = {
  "from-bottom": {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  "from-center": {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.5, opacity: 0 },
  },
  "from-top": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "-100%", opacity: 0 },
  },
  "from-left": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  },
  "from-right": {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  "top-in-bottom-out": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  "left-in-right-out": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
};

const getYouTubeVideoId = (url: string): string => {
  if (!url) return "";

  // Handle youtu.be short URLs
  if (url.includes("youtu.be/")) {
    return url.split("youtu.be/")[1]?.split("?")[0]?.split("&")[0] || "";
  }
  // Handle youtube.com/watch?v= URLs
  else if (url.includes("youtube.com/watch")) {
    const urlParams = new URLSearchParams(url.split("?")[1]);
    return urlParams.get("v") || "";
  }
  // Handle youtube.com/v/ URLs
  else if (url.includes("youtube.com/v/")) {
    return url.split("youtube.com/v/")[1]?.split("?")[0]?.split("&")[0] || "";
  }
  // Handle youtube.com/embed/ URLs
  else if (url.includes("youtube.com/embed/")) {
    return url.split("youtube.com/embed/")[1]?.split("?")[0]?.split("&")[0] || "";
  }

  return "";
};

const getEmbedUrl = (url: string): string => {
  if (!url) return "";

  // If it's already an embed URL, return as is
  if (url.includes("youtube.com/embed/") || url.includes("youtu.be/embed/")) {
    return url;
  }

  const videoId = getYouTubeVideoId(url);

  // If we found a video ID, return the embed URL
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // If it's not a YouTube URL, return as is (could be Vimeo, etc.)
  return url;
};

function getYouTubeThumbnail(videoId: string, quality = "maxresdefault") {
  if (!videoId || typeof videoId !== "string") {
    return "";
  }

  const validQualities = ["default", "mqdefault", "hqdefault", "sddefault", "maxresdefault"];
  if (!validQualities.includes(quality)) {
    quality = "maxresdefault";
  }

  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}

export function HeroVideoDialog({
  animationStyle = "from-center",
  videoSrc,
  thumbnailSrc,
  thumbnailAlt = "Video thumbnail",
  styles,
  blockProps,
  inBuilder,
}: HeroVideoProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const selectedAnimation = animationVariants[animationStyle];
  const embedUrl = getEmbedUrl(videoSrc);

  // Use provided thumbnail or auto-generate from YouTube video
  const videoId = getYouTubeVideoId(videoSrc);
  const autoThumbnail = videoId ? getYouTubeThumbnail(videoId) : "";
  const posterImage = (thumbnailSrc && thumbnailSrc.includes("https://")) || autoThumbnail;

  const handlePlayClick = () => {
    if (inBuilder && !videoSrc) {
      // Don't open modal in builder if video URL is empty
      return;
    }
    setIsVideoOpen(true);
  };

  return (
    <div {...blockProps} {...styles}>
      <button
        type="button"
        aria-label="Play video"
        className="group relative w-full h-full cursor-pointer border-0 bg-transparent p-0"
        onClick={handlePlayClick}>
        {posterImage ? (
          <img
            src={posterImage}
            alt={thumbnailAlt}
            width={1920}
            height={1080}
            className="w-full h-full rounded-md border shadow-lg transition-all duration-200 ease-out group-hover:brightness-[0.8]"
          />
        ) : (
          <div className="flex aspect-video w-full items-center justify-center rounded-md border bg-muted shadow-lg transition-all duration-200 ease-out group-hover:brightness-[0.8]">
            <p className="text-sm text-muted-foreground">
              {inBuilder ? "Add a YouTube URL to preview" : "No thumbnail available"}
            </p>
          </div>
        )}
        {posterImage && (
          <div className="absolute inset-0 flex scale-[0.9] items-center justify-center rounded-2xl transition-all duration-200 ease-out group-hover:scale-100">
            <div className="bg-primary/10 flex size-28 items-center justify-center rounded-full backdrop-blur-md">
              <div
                className={`from-primary/30 to-primary relative flex size-20 scale-100 items-center justify-center rounded-full bg-gradient-to-b shadow-md transition-all duration-200 ease-out group-hover:scale-[1.2]`}>
                <Play
                  className="size-8 scale-100 fill-white text-white transition-transform duration-200 ease-out group-hover:scale-105"
                  style={{
                    filter: "drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))",
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </button>
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
                setIsVideoOpen(false);
              }
            }}
            onClick={() => setIsVideoOpen(false)}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
            <motion.div
              {...selectedAnimation}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative mx-4 aspect-video w-full max-w-4xl md:mx-0">
              <motion.button className="absolute -top-16 right-0 rounded-full bg-background/50 p-2 text-xl text-foreground ring-1 backdrop-blur-md">
                <XIcon className="size-5" />
              </motion.button>
              <div className="relative isolate z-[1] size-full overflow-hidden rounded-md border-2 border-border">
                <iframe
                  src={embedUrl}
                  title="Hero Video player"
                  className="size-full rounded-md"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
