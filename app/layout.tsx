import type {Metadata, Viewport} from "next";
import {Suspense} from "react";
import "./globals.css";
import {DataRefresh} from "@/components/data-refresh";

export const metadata: Metadata = {
  title: "BOZO",
  description: "BOZO — field ops",
  applicationName: "BOZO",
  appleWebApp: {
    capable: true,
    title: "BOZO",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [{url: "/icons/icon-192.png", sizes: "192x192", type: "image/png"}],
    apple: [{url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png"}],
  },
  formatDetection: {telephone: false},
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#102a43",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className="min-h-dvh overscroll-none">
        <Suspense fallback={null}>
          <DataRefresh />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
