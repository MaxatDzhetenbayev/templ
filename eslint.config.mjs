// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import { FlatCompat } from "@eslint/eslintrc";
// import boundaries from "eslint-plugin-boundaries";
import eslintJsDoc from "eslint-plugin-jsdoc";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import sonarJs from "eslint-plugin-sonarjs";
import storybook from "eslint-plugin-storybook";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: ["**/.next/**"],
  },
  {
    plugins: {
      // boundaries,
      jsdoc: eslintJsDoc,
      sonarjs: sonarJs,
      "simple-import-sort": simpleImportSort,
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
      // "boundaries/elements": [
      //   { type: "app", pattern: "src/app/**" },
      //   { type: "features", pattern: "src/features/**" },
      //   { type: "shared", pattern: "src/shared/**" },
      // ],
      // "boundaries/resolve": {
      //   alias: {
      //     "@": "./src",
      //   },
      //   extensions: [".ts", ".tsx", ".js", ".jsx"],
      // },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "no-console": "warn",
      "no-debugger": "warn",

      // sonarjs rules
      "sonarjs/no-duplicate-string": "warn",
      "sonarjs/no-identical-functions": "warn",
      "sonarjs/no-duplicated-branches": "warn",
      "sonarjs/no-identical-conditions": "warn",
      "sonarjs/no-small-switch": "warn",
      "sonarjs/no-inverted-boolean-check": "warn",
      "sonarjs/no-use-of-empty-return-value": "warn",
      "sonarjs/prefer-single-boolean-return": "warn",
      "sonarjs/no-nested-switch": "warn",
      "sonarjs/cognitive-complexity": ["error", 15],

      // jsdoc rules
      "jsdoc/require-jsdoc": [
        "warn",
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
          },
        },
      ],
      "jsdoc/require-returns": "warn",
      "jsdoc/require-param": "warn",
      "jsdoc/check-param-names": "error",
      "jsdoc/check-tag-names": "error",

      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            // Внешние библиотеки
            ["^@?\\w"],
            // Абсолютные импорты
            ["^@/"],
            // Относительные импорты
            ["^\\./"],
          ],
        },
      ],
      // "boundaries/element-types": [
      //   "error",
      //   {
      //     default: "allow",
      //     rules: [
      //       {
      //         from: "shared",
      //         disallow: ["features", "app"],
      //         message:
      //           "Модуль нижележащего слоя (${file.type}) не может импортировать модуль вышележащего слоя (${dependency.type})",
      //       },
      //       {
      //         from: "features",
      //         disallow: ["app"],
      //         message:
      //           "Модуль нижележащего слоя (${file.type}) не может импортировать модуль вышележащего слоя (${dependency.type})",
      //       },
      //     ],
      //   },
      // ],
      // "boundaries/entry-point": [
      //   2,
      //   {
      //     default: "disallow",
      //     message:
      //       "Модуль (${file.type}) должен импортироваться через public API. Прямой импорт из ${dependency.source} запрещен",

      //     rules: [
      //       {
      //         target: ["shared", "app"],
      //         allow: "**",
      //       },
      //       {
      //         target: ["features"],
      //         allow: "index.(ts|tsx)",
      //       },
      //     ],
      //   },
      // ],
    },
  },
  {
    files: [
      "src/app/**/page.tsx",
      "src/app/**/layout.tsx",
      "src/shared/**/*.{ts,tsx}",
    ],
    rules: {
      "jsdoc/require-jsdoc": "off",
    },
  },
  {
    files: ["src/shared/**/*.{ts,tsx}"],
    rules: {
      "simple-import-sort/imports": "off",
    },
  },
  {
    files: ["src/shared/api/generated.ts"],
    rules: {
      "jsdoc/require-jsdoc": "off",
      "jsdoc/require-returns": "off",
      "jsdoc/require-param": "off",
      "jsdoc/check-param-names": "off",
      "jsdoc/check-tag-names": "off",
    },
  },
  ...storybook.configs["flat/recommended"],
];

export default eslintConfig;
