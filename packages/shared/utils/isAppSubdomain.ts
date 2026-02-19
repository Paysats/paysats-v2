export const isAppSubdomain = () => {
  if (typeof window === "undefined") return false;
  return window.location.hostname.startsWith("app.");
};
