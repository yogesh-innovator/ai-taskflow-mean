module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:import/recommended", "prettier"],
  parserOptions: {
    ecmaVersion: 12,
  },
  plugins: ["import"],
  rules: {
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "import/order": [
      "warn",
      {
        groups: [["builtin", "external", "internal"]],
        "newlines-between": "always",
      },
    ],
  },
};
