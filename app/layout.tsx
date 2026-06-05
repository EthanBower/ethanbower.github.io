import type { Metadata, Viewport } from "next";
import { Geist, Space_Grotesk } from "next/font/google";
import { SettingsProvider } from "@/lib/components/global/settingsProvider";
import "./globals.css";

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
      <body>
        <script dangerouslySetInnerHTML={{
          __html: `
  (function() {
    // 1. Change this version string (e.g., 'v1.1') EVERY time you deploy a breaking fix
    var CURRENT_VERSION = 'v1.0.1'; 
    
    var localVersion = localStorage.getItem('app_version');
    
    if (localVersion !== CURRENT_VERSION) {
      localStorage.setItem('app_version', CURRENT_VERSION);
      
      // 2. Only reload if this isn't the first ever visit to prevent reload loops
      if (localVersion) {
        window.location.reload(true); 
      }
    }
  })();
`}} />

        <SettingsProvider>{children}</SettingsProvider>
      </body>
    </html>
  );
}
