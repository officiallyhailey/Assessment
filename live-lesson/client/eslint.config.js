// Deliberately loose. Nothing here depends on linting, and a red squiggle is a
// poor reason to lose the thread of what you are writing.
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
