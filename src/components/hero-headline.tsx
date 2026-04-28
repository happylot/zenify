"use client";

import { useEffect, useState } from "react";

const words = ["Customer", "Employee", "Partner"];
const HOLD_MS = 1400;
const TYPE_MS = 110;
const DELETE_MS = 55;

export function HeroHeadline() {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];

    if (!isDeleting && displayed.length < currentWord.length) {
      const timer = window.setTimeout(() => {
        setDisplayed(currentWord.slice(0, displayed.length + 1));
      }, TYPE_MS);
      return () => window.clearTimeout(timer);
    }

    if (!isDeleting && displayed.length === currentWord.length) {
      const timer = window.setTimeout(() => {
        setIsDeleting(true);
      }, HOLD_MS);
      return () => window.clearTimeout(timer);
    }

    if (isDeleting && displayed.length > 0) {
      const timer = window.setTimeout(() => {
        setDisplayed(currentWord.slice(0, displayed.length - 1));
      }, DELETE_MS);
      return () => window.clearTimeout(timer);
    }

    const timer = window.setTimeout(() => {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 180);

    return () => window.clearTimeout(timer);
  }, [displayed, isDeleting, wordIndex]);

  return (
    <h1 className="hero-title">
      The Future of{" "}
      <span className="hero-keyword-shell">
        <span className="hero-keyword-glow" aria-hidden="true" />
        <span className="hero-keyword">
          {displayed}
          <span className="hero-caret" aria-hidden="true" />
        </span>
      </span>{" "}
      Experience Starts with Zenify
    </h1>
  );
}
