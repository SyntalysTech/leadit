"use client";

import { useState, useRef, useEffect } from "react";

const videos = ["/videos/hero-video.mp4", "/videos/hero2-video.mp4"];

export default function HeroVideo() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      setCurrentIndex((prev) => (prev + 1) % videos.length);
    };

    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, []);

  // Reset and play when video changes
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.load();
      video.play();
    }
  }, [currentIndex]);

  return (
    <video
      ref={videoRef}
      src={videos[currentIndex]}
      autoPlay
      muted
      playsInline
      className="w-full h-auto"
    />
  );
}
