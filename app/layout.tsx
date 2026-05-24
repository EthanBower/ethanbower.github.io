import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ethan Bower",
  description: "Portfolio Website Created by Ethan Bower"
};

export const viewport: Viewport = { 
  width: "device-width", initialScale: 1, viewportFit: "cover" 
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode;}>) {
  const versionNumber = process.env.SITE_APP_VERSION || "dev-local";

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body>
        {children}
        <div className="absolute bottom-0 left-0 w-full m-0 p-0 pb-0.5 text-center text-white/50 text-[10px] font-mono select-none z-50 pointer-events-none">
          {versionNumber}
        </div>
      </body>
    </html>
  );
}