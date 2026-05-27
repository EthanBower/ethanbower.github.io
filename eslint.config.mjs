import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import noWarningComments from "eslint-plugin-no-warning-comments";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      "no-warning-comments": noWarningComments,
    },
    rules: {
      "no-warning-comments/no-warning-comments": [
        "warn",
        { 
          terms: ["todo", "fixme"], 
          location: "start"
        }
      ],
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;