import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/context/auth-context";
import { Toaster } from "sonner";
import { BackToTop } from "@/components/shared/back-to-top";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CommunityConnect — Social Development Events Platform",
    template: "%s | CommunityConnect",
  },
  description:
    "Discover, organize, and participate in grassroots social development initiatives. Empowering communities through clean drives, health camps, tree plantations, and relief programs.",
  keywords: [
    "Community Development",
    "Social Impact",
    "Volunteer Events",
    "Tree Plantation",
    "Health Camps",
    "Disaster Relief",
    "Grassroots Organizers",
  ],
  authors: [{ name: "CommunityConnect Team" }],
  openGraph: {
    title: "CommunityConnect — Social Development Events Platform",
    description:
      "Discover, organize, and join impactful grassroots social initiatives across your neighborhood.",
    type: "website",
    locale: "en_US",
    siteName: "CommunityConnect",
  },
  twitter: {
    card: "summary_large_image",
    title: "CommunityConnect — Social Development Events Platform",
    description: "Discover, organize, and join grassroots social initiatives in your neighborhood.",
  },
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
          <AuthProvider>
            {children}
            <Toaster position="top-right" richColors closeButton />
            <BackToTop />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
