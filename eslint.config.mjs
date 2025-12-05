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
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
    "coverage/**",
  ]),
  {
    rules: {
      // Code quality
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "warn",
      "no-unused-vars": "off", // TypeScript handles this
      "@typescript-eslint/no-unused-vars": ["warn", { 
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      }],
      "@typescript-eslint/no-explicit-any": "warn",
      
      // Complexity
      "complexity": ["warn", 15],
      "max-depth": ["warn", 4],
      "max-lines-per-function": ["warn", { max: 100, skipBlankLines: true, skipComments: true }],
      
      // React best practices
      "react/jsx-no-target-blank": "error",
      "react/no-array-index-key": "warn",
      "react/jsx-key": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      
      // Import organization
      "import/order": ["warn", {
        "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
        "newlines-between": "never",
        "alphabetize": { order: "asc", caseInsensitive: true }
      }],
      
      // TypeScript specific
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-non-null-assertion": "warn",
    },
  },
]);

export default eslintConfig;
