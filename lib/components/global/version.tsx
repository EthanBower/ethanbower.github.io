export default function Version() {
    const versionNumber = process.env.SITE_APP_VERSION || "dev-local";

    return (
        <div className="absolute bottom-0 left-0 w-full m-0 p-0 pb-0.5 text-center text-white/50 text-[10px] font-mono select-none z-50 pointer-events-none">
            {versionNumber}
        </div>
    );
}
