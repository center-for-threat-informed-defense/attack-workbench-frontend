import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
    // Base config for all files - adding Node.js globals
    { 
        files: ["**/*.{js,mjs,cjs,ts}"],
        languageOptions: { 
            globals: {
                ...globals.browser,
                ...globals.node     // Add Node.js globals which include 'require' and 'exports'
            },
            sourceType: "module"  // Set sourceType to ECMAScript
        }
    },
    // Specific config for test files
    {
        files: ["**/*.spec.ts"],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.mocha
            },
            sourceType: "module"  // Set sourceType to ECMAScript for tests
        }
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    eslintPluginPrettierRecommended
];