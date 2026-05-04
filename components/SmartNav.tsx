"use client";

import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState
} from "react";

type SmartNavProps = {
  children: ReactNode;
  className?: string;
};

export function SmartNav({ children, className = "" }: SmartNavProps) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    const getScrollY = () =>
      window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;

    function updateFromScrollPosition() {
      const currentScrollY = getScrollY();
      const previousScrollY = lastScrollYRef.current;
      const delta = currentScrollY - previousScrollY;

      if (currentScrollY < 24) {
        setIsVisible(true);
        lastScrollYRef.current = currentScrollY;
        return;
      }

      if (delta > 1) {
        setIsVisible(false);
      }

      if (delta < -1) {
        setIsVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    }

    lastScrollYRef.current = getScrollY();

    function handleScroll() {
      if (tickingRef.current) {
        return;
      }

      tickingRef.current = true;

      window.requestAnimationFrame(() => {
        updateFromScrollPosition();
        tickingRef.current = false;
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("scroll", handleScroll, { capture: true, passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScroll, { capture: true });
    };
  }, []);

  const style = {
    opacity: isVisible ? 1 : 0,
    pointerEvents: isVisible ? "auto" : "none",
    transform: isVisible ? "translateY(0)" : "translateY(calc(-100% - 2rem))"
  } satisfies CSSProperties;

  return (
    <header
      className={`sticky top-4 z-40 transition duration-300 ease-out motion-reduce:opacity-100 motion-reduce:transform-none sm:top-6 ${className}`}
      style={style}
    >
      {children}
    </header>
  );
}
