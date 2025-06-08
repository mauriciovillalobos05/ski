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
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // ❌ permite usar any
      "@typescript-eslint/no-unused-vars": [
        "warn", // ⚠️ solo avisa, no lanza error
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }, // ignora variables con _
      ],
    },
  },
];

export default eslintConfig;