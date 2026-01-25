import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { BackgroundMusicProvider } from "@/components/audio/BackgroundMusicProvider";

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
  title: "Resume Scanner - HR-418 (Teapot)",
  description: "HR-418 (TEAPOT) is a futuristic HR robot that scans resumes and returns structured feedback.",
  metadataBase: new URL("https://project-teapot.hr-418-teapot.workers.dev"),
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon0.svg", type: "image/svg+xml" },
      { url: "/icon1.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png" }],
  },
  openGraph: {
    title: "HR-418",
    description: "HR-418 (TEAPOT) is a futuristic HR robot that scans resumes and returns structured feedback.",
    images: [
      {
        url: "/scene-bg.png",
        width: 1200,
        height: 630,
        alt: "HR-418 robot in futuristic office setting",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HR-418",
    description: "HR-418 (TEAPOT) is a futuristic HR robot that scans resumes and returns structured feedback.",
    images: ["/scene-bg.png"],
  },
  other: {
    "apple-mobile-web-app-title": "HR-418",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BackgroundMusicProvider
          src="/audio/bg-music.m4a"
          track={{ title: "Vanishing Point", artist: "Playback" }}
        >
          {children}
        </BackgroundMusicProvider>
      </body>
    </html>
  );
}
