import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/** Lets visitors add HisabBD to their phone's home screen. No offline caching. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name}: ${siteConfig.tagline}`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#006a4e",
    lang: "en-BD",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
