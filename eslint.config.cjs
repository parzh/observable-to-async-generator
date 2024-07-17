const tsEslintPlugin = require("@typescript-eslint/eslint-plugin")
const tsEslintParser = require("@typescript-eslint/parser")
const globals = require("globals")
const eslintJs = require("@eslint/js")

const { FlatCompat } = require("@eslint/eslintrc")

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: eslintJs.configs.recommended,
    allConfig: eslintJs.configs.all
})

module.exports = [{
    ignores: ["**/node_modules", "**/dist"],
}, ...compat.extends("eslint:recommended", "plugin:@typescript-eslint/recommended", "love"), {
    plugins: {
        "@typescript-eslint": tsEslintPlugin,
    },

    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.jest,
        },

        parser: tsEslintParser,
        ecmaVersion: 5,
        sourceType: "commonjs",

        parserOptions: {
            project: "./tsconfig.json",
        },
    },

    rules: {
        "comma-dangle": "off",
        "@typescript-eslint/comma-dangle": ["error", "always-multiline"],
        indent: "off",

        "@typescript-eslint/indent": ["error", 2, {
            SwitchCase: 1,
            flatTernaryExpressions: false,

            ignoredNodes: [
                "PropertyDefinition[decorators]",
                "TSUnionType",
                "FunctionExpression[params]:has(Identifier[decorators])",
            ],
        }],

        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/space-before-function-paren": "off",
        "@typescript-eslint/strict-boolean-expressions": "off",
        "@typescript-eslint/no-misused-promises": "off",
        "@typescript-eslint/restrict-template-expressions": "off",
        "@typescript-eslint/method-signature-style": "off",
        semi: "off",
        "space-before-function-paren": "off",
    },
}]
