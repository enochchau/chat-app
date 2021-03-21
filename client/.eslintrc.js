module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  extends: "eslint:recommended",
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react-hooks"],
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: "module",
  },
  rules: {
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    "no-console": "warn",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { 
        vars: "all", 
        args: "after-used", 
        ignoreRestSiblings: false,
      },
    ],
    "@typescript-eslint/no-type-alias":[
      "error",
      {
        allowAliases: "always",
        allowLiterals: "always",
      }
    ],
    "@typescript-eslint/no-redeclare": ["error"],
    "@typescript-eslint/explicit-function-return-type": "warn", // Consider using explicit annotations for object literals and function return types even when they can be inferred.
    "no-empty": "warn",
    "no-undef": [2, { "typeof": true }],
  },
  "globals":{
    "localStorage": true,
    "sessionStorage": true,
    "NodeListOf": true,
    "ChildNode": true,
    "HTMLDivElement": true,
  },
};