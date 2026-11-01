import type { MetadataRoute } from "next";

/**
 * Concept: Web Application Manifest in Next.js App Router.
 * Why: Enables progressive web app capabilities, mobile home-screen installability,
 *      and sets platform brand colors for CommunityConnect.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CommunityConnect — Social Development Events",
    short_name: "CommunityConnect",
    description: "Discover, organize, and participate in grassroots social development initiatives.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#059669",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
