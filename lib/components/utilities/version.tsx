export default function Version() {
    return process.env.SITE_APP_VERSION || "dev-local";
}