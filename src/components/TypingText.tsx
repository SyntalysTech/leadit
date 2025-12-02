"use client";

import { useState, useEffect } from "react";

const phrases = [
  "que nunca duerme",
  "disponible 24/7",
  "que cierra ventas",
  "que no descansa",
  "impulsado por IA",
];

export default function TypingText() {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const phrase = phrases[currentPhrase];
    const speed = isDeleting ? 30 : 50;

    if (!isDeleting && displayText === phrase) {
      // Pausa antes de borrar
      const timeout = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
      return;
    }

    const timeout = setTimeout(() => {
      if (isDeleting) {
        setDisplayText(phrase.substring(0, displayText.length - 1));
      } else {
        setDisplayText(phrase.substring(0, displayText.length + 1));
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentPhrase]);

  return (
    <span className="text-brand">
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
}
