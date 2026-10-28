import type { NextConfig } from "next";

const baseHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

/** Every page except embeds: no framing by other sites. */
const securityHeaders = [...baseHeaders, { key: "X-Frame-Options", value: "SAMEORIGIN" }];

/** /embed/* pages are meant to be framed on other websites (src/app/embed). */
const embedHeaders = [...baseHeaders, { key: "Content-Security-Policy", value: "frame-ancestors *" }];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Each locale has its own root layout (for <html lang>), so unmatched URLs
  // need a global 404 document: src/app/global-not-found.tsx.
  experimental: { globalNotFound: true },
  async headers() {
    return [
      { source: "/:path((?!embed/).*)", headers: securityHeaders },
      { source: "/embed/:path*", headers: embedHeaders },
    ];
  },
};

export default nextConfig;
