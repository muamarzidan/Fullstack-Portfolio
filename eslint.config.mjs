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
      // Ignore generated Prisma files
      "src/generated/**/*",
      "prisma/generated/**/*",
      // Other common ignores
      ".next/**/*",
      "node_modules/**/*",
      "dist/**/*",
      "build/**/*"
    ]
  },
  {
    rules: {
      // Allow unused variables in some cases
      "@typescript-eslint/no-unused-vars": "warn",
      // Allow any type for complex external libraries
      "@typescript-eslint/no-explicit-any": "warn",
      // Allow img elements (warnings only)
      "@next/next/no-img-element": "warn",
      // Allow missing dependencies in useEffect for complex cases
      "react-hooks/exhaustive-deps": "warn"
    }
  }
];

export default eslintConfig;
