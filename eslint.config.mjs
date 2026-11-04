import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Links prefetch on intent only (see src/components/ui/lazy-link.tsx).
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/components/ui/lazy-link.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        { paths: [{ name: "next/link", message: "Use LazyLink from @/components/ui/lazy-link: it prefetches on intent only." }] },
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "next-env.d.ts",
    "test-results/**",
    "playwright-report/**",
    "blob-report/**",
    ".claude/**",
  ]),
]);
