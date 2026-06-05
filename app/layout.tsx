import type { Metadata, Viewport } from "next";
import { Geist, Space_Grotesk } from "next/font/google";
import { SettingsProvider } from "@/lib/components/global/settingsProvider";
import "./globals.css";
import Script from "next/script";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ethan Bower",
  description: "Portfolio Website Created by Ethan Bower",
  other: {
    'cache-control': 'no-cache, no-store, must-revalidate',
    'pragma': 'no-cache',
    'expires': '0'
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.className} ${geistSans.variable} h-full antialiased`}
    >
      <head>
        <Script
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var DEPLOY_VERSION = 'v1.0.1'; 
                var savedVersion = localStorage.getItem('app_version');
                
                if (savedVersion !== DEPLOY_VERSION) {
                  localStorage.setItem('app_version', DEPLOY_VERSION);
                  
                  if (savedVersion) {
                    window.location.reload(true);
                  }
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <SettingsProvider>{children}</SettingsProvider>
      </body>
    </html>
  );
}
