import { useState, useEffect } from "react";

export function useKeyboardVisible() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;

    const vv = window.visualViewport;
    const threshold = 150; // px difference to consider keyboard open

    const handleResize = () => {
      const keyboardOpen = window.innerHeight - vv.height > threshold;
      setVisible(keyboardOpen);
    };

    vv.addEventListener("resize", handleResize);
    return () => vv.removeEventListener("resize", handleResize);
  }, []);

  return visible;
}
