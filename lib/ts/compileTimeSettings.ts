export function getVersion(): string {
    return process.env.SITE_APP_VERSION || "dev-local";
}
