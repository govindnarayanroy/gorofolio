// postcss.config.js
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {}, // ← new plugin that bundles Tailwind v4
    autoprefixer: {},
  },
};