import js from "@eslint/js"
import { FlatCompat } from "@eslint/eslintrc"
import tsEslint from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import globals from "globals"
import { dirname } from "path"
import { fileURLToPath } from "url"

const packageRootDir = dirname(fileURLToPath(import.meta.url))
const compat = new FlatCompat({
  baseDirectory: packageRootDir,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  {
    ignores: ["**/node_modules", "**/dist", "**/*.snap.ts", "eslint.config.mjs"],
  },
  ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:import/recommended",
    "plugin:n/recommended",
    "plugin:promise/recommended",
  ),
  {
    plugins: {
      "@typescript-eslint": tsEslint,
    },
    settings: {
      "import/resolver": {
        node: {
          extensions: [".ts"],
        },
      },
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 5,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      "comma-dangle": ["error", "always-multiline"],

      indent: ["error", 2, {
        SwitchCase: 1,
        flatTernaryExpressions: false,
        ignoredNodes: [
          "PropertyDefinition[decorators]",
          "TSUnionType",
          "FunctionExpression[params]:has(Identifier[decorators])",
        ],
      }],

      "@typescript-eslint/space-before-function-paren": "off",
      "@typescript-eslint/strict-boolean-expressions": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/promise-function-async": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/method-signature-style": "off",

      semi: "off",
      "space-before-function-paren": "off",

      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "n/no-missing-import": "off",
      "promise/always-return": "off",
    },
  },
]
