import { tanstackConfig } from "@tanstack/eslint-config";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
   ...tanstackConfig,
   {
      rules: {
         "sort-imports": "off",
         "import/order": "off",
         "import/consistent-type-specifier-style": "off",
         "@typescript-eslint/array-type": "off",
      },
   },
   globalIgnores([".output/*"]),
]);
