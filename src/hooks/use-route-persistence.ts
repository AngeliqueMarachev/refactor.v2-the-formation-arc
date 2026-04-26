import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ROUTE_KEY = "last_route";
const TIMESTAMP_KEY = "last_route_ts";
const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

// Routes that should NOT be saved/restored
const EXCLUDED_ROUTES = ["/auth", "/reset-password", "/onboarding"];

/** Persist the current route + timestamp on every navigation. */
export function useRoutePersistence() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!EXCLUDED_ROUTES.includes(pathname)) {
      localStorage.setItem(ROUTE_KEY, pathname);
      localStorage.setItem(TIMESTAMP_KEY, Date.now().toString());
    }
  }, [pathname]);
}

/**
 * On mount, check if we should restore a saved route.
 * Returns the route to navigate to, or null.
 */
export function useRouteRestoration() {
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem(ROUTE_KEY);
    const ts = localStorage.getItem(TIMESTAMP_KEY);

    if (!saved || !ts) return;

    const elapsed = Date.now() - Number(ts);

    if (elapsed <= SIX_HOURS_MS && saved !== "/" && !EXCLUDED_ROUTES.includes(saved)) {
      // Within 6 hours — restore previous screen
      navigate(saved, { replace: true });
    }
    // > 6 hours or root — stay on home (default routing handles this)
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
