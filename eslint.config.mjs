import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    ".next-*/**",
    "artifacts/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated from the live-site capture (scripts/generate).
    "src/generated/**",
    "src/app/(landing-*)/**/LandingBody.tsx",
    "capture/**",
    "public/**",
  ]),
]);

export default eslintConfig;
