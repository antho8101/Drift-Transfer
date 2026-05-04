"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

type SmartNavProps = {
  children: ReactNode;
  className?: string;
};

export function SmartNav({ children, className = "" }: SmartNavProps) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    function handleScroll() {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollYRef.current;

      if (currentScrollY < 24) {
        setIsVisible(true);
        lastScrollYRef.current = currentScrollY;
        return;
      }

      if (delta > 8) {
        setIsVisible(false);
      }

      if (delta < -4) {
        setIsVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-4 z-40 transition duration-300 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 sm:top-6 ${
        isVisible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-[calc(100%+2rem)] opacity-0"
      } ${className}`}
    >
      {children}
    </header>
  );
}
