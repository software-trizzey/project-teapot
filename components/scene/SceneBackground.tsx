"use client";

import { cn } from "@/lib/helpers";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef } from "react";

export type SceneBackgroundProps = {
  backgroundSrc: string | StaticImageData;
  backgroundAlt?: string;
  videoSrc: string | null;
  isVideoVisible: boolean;
  className?: string;
  onVideoEnded?: () => void;
  onVideoError?: () => void;
  isFullScreen?: boolean;
};

export default function SceneBackground({
  backgroundSrc,
  backgroundAlt = "Robo Resume scene",
  videoSrc,
  isVideoVisible,
  className,
  onVideoEnded,
  onVideoError,
  isFullScreen = false,
}: SceneBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!isVideoVisible || !videoSrc) {
      return;
    }

    const video = videoRef.current;
    if (!video) {
      return;
    }

    video.currentTime = 0;
    void video.play().catch(() => undefined);
  }, [isVideoVisible, videoSrc]);

  const backgroundClasses = cn(
    "absolute inset-0 h-full w-full object-cover transition-opacity duration-300 bg-black",
    isVideoVisible ? "opacity-0" : "opacity-100"
  );

  const videoClasses = cn(
    "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
    isVideoVisible ? "opacity-100" : "opacity-0 pointer-events-none"
  );

  return (
    <div
      className={cn(
        "relative overflow-hidden transition-all duration-500",
        isFullScreen ? "h-full w-full" : "aspect-video w-full max-w-[1024px]",
        className
      )}
    >
      <Image
        src={backgroundSrc}
        alt={backgroundAlt}
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 1024px"
        className={backgroundClasses}
      />
      {videoSrc ? (
        <video
          ref={videoRef}
          key={videoSrc}
          className={videoClasses}
          src={videoSrc}
          muted
          playsInline
          preload="auto"
          onEnded={onVideoEnded}
          onError={onVideoError}
        />
      ) : null}
    </div>
  );
}
