"use client";

export default function LoadingSpinner() {
    return (
        <div className="relative h-6 w-6 flex-none animate-spin">
            <div className="absolute inset-0 rounded-full border-2 border-gray-200" />
            <div className="absolute inset-0 rounded-full">
                <div className="h-full w-full rounded-full border-2 border-transparent border-t-blue-500 opacity-80" />
            </div>
            <div className="absolute inset-0 rounded-full rotate-45">
                <div className="h-full w-full rounded-full border-2 border-transparent border-t-purple-500 opacity-40" />
            </div>
        </div>
    );
}