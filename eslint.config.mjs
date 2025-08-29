import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    // Add custom rules here
    rules: {
      // Disables the rule that flags the use of `any` as an error
      "@typescript-eslint/no-explicit-any": "off",
      // Disables the rule that flags the use of `require()` as an error
      "@typescript-eslint/no-require-imports": "off",
      // Disables the rule that flags unused variables as an error
      "@typescript-eslint/no-unused-vars": "off"
    }
  }
];

export default eslintConfig;