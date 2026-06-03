export function getAppVersion() {
  return process.env.SITE_APP_VERSION || "dev-local";
}