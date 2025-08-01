import globals from "globals";
import tseslint, { parser } from "typescript-eslint";
import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import unusedImports from "eslint-plugin-unused-imports";
import airbnbBase from "eslint-config-airbnb-base";
import airbnbBaseTypescript from "eslint-config-airbnb-base-typescript";



/** type {import('eslint').linter.Config[]} */

export default [
  js.configs.recommended,
  {

    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.browser,
        ...globals.node,
      }
    },
    plugins: {
      "@typescript-eslint": tseslint,
      "uunused-imports": unusedImports
    },
    rules: {
      ...airbnbBase.rules,
      ...airbnbBaseTypescript.rules,
      "no-unused-vars": "off",
      "unused-impors/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        }
      ]
    },
    settings:
    {
      "import/resolver": {
        node: {
          extensions: [".js", "jsx", "ts", "tsx"]
        }
      }
    }
  },
];