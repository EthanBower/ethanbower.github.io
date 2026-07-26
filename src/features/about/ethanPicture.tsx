"use client";

import Image from "next/image";

type EthanPictureProps = {
    src: string;
    alt: string;
};

export default function EthanPicture({ src, alt }: EthanPictureProps) {
    return (
        <div className="flex items-center justify-center m-3 md:m-none md:h-screen md:w-1/2">
            <div className="relative inline-block overflow-hidden rounded-2xl">
                <Image
                    src={src}
                    alt={alt}
                    width={450}
                    height={560}
                    priority
                    className="block max-h-[85vh] w-auto object-contain"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent p-6">
                    <h2 className="text-2xl font-bold text-white">
                        Ethan
                    </h2>
                    <p className="text-sm uppercase tracking-widest text-cyan-300">
                        Software Engineer
                    </p>
                </div>
            </div>
        </div>
    );
}