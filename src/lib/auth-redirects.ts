const PRODUCTION_APP_URL = "https://theformationarc.lovable.app";

const normalizePath = (path: string) => (path.startsWith("/") ? path : `/${path}`);

export const getAuthRedirectUrl = (path: string) => {
  const normalizedPath = normalizePath(path);
  const baseUrl = import.meta.env.PROD ? PRODUCTION_APP_URL : window.location.origin;
  return `${baseUrl}${normalizedPath}`;
};

export const validateProductionAuthRedirectOrigin = () => {
  if (!import.meta.env.PROD) return;

  const expectedOrigin = new URL(PRODUCTION_APP_URL).origin;
  if (window.location.origin !== expectedOrigin) {
    console.warn(
      `Production auth redirects are configured for ${expectedOrigin}. Confirm the app Site URL and allowed redirect URLs use this production domain.`
    );
  }
};