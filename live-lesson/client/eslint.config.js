// Kept minimal on purpose. The class project has a fuller config; nothing here
// depends on it, and a lesson should not stall on a lint rule.
export default [
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {},
  },
];
