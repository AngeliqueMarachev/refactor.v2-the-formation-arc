import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * Resets viewport scroll to the top on every route, query, or hash change.
 * Uses "instant" so users never see a half-scrolled new screen — important
 * on iOS Safari and Android Chrome where the URL bar collapses on scroll.
 */
const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();
  const prev = useRef({ pathname, search, hash });

  useEffect(() => {
    const changed =
      prev.current.pathname !== pathname ||
      prev.current.search !== search ||
      prev.current.hash !== hash;

    if (changed) {
      prev.current = { pathname, search, hash };
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      // Defer once more in case the new route renders content async
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      });
    }
  }, [pathname, search, hash]);

  return null;
};

export default ScrollToTop;
