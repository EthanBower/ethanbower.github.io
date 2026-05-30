export default function Version() {
    const versionNumber = process.env.SITE_APP_VERSION || "dev-local";

    return (
        <div className="absolute top-0 left-0 w-full p-[5px] pr-[10px] text-right text-white/50 text-[10px] select-none z-50 pointer-events-none">
            <p>{versionNumber}</p>
        </div>
    );
}
