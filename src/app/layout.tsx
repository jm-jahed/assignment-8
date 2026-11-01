import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";

/**
 * Concept: Root Next.js Layout
 * Why:
 * The root layout wraps all pages in the App Router. It is the single place
 * to declare global fonts, SEO metadata, theme providers, and global notification containers.
 *
 * How:
 * 1. Fonts: Loads Geist & Geist Mono with CSS variables for clean performance.
 * 2. ThemeProvider: Prevents hydration mismatch while allowing light/dark theme toggling.
 * 3. Toaster: Sonner toast notification host mounted globally at top-right.
 */

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CommunityConnect — Social Development Events Platform",
  description:
    "Discover, organize, and participate in grassroots social development initiatives in your community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          {/* Global toast notification system */}
          <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
