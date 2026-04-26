import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    // Only reset scroll on actual route changes, not local state changes
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
