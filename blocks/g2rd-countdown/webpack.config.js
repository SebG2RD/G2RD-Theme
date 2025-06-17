const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  ...defaultConfig,
  entry: {
    index: "./src/index.js",
    "countdown-frontend": "./src/countdown-frontend.js",
    "style-index": "./src/style-index.js",
  },
  plugins: [
    ...(defaultConfig.plugins || []),
    new MiniCssExtractPlugin({
      filename: ({ chunk = {} }) => {
        if (chunk.name === "style-index") {
          return "style-index.css";
        }
        return "[name].css";
      },
    }),
  ],
  module: {
    ...defaultConfig.module,
    rules: [
      ...defaultConfig.module.rules,
      {
        test: /countdown\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
    ],
  },
  resolve: {
    ...defaultConfig.resolve,
    alias: {
      ...defaultConfig.resolve.alias,
      "@wordpress/blocks": path.resolve(
        __dirname,
        "../../node_modules/@wordpress/blocks"
      ),
      "@wordpress/components": path.resolve(
        __dirname,
        "../../node_modules/@wordpress/components"
      ),
      "@wordpress/block-editor": path.resolve(
        __dirname,
        "../../node_modules/@wordpress/block-editor"
      ),
      "@wordpress/i18n": path.resolve(
        __dirname,
        "../../node_modules/@wordpress/i18n"
      ),
      "@wordpress/element": path.resolve(
        __dirname,
        "../../node_modules/@wordpress/element"
      ),
      "@wordpress/date": path.resolve(
        __dirname,
        "../../node_modules/@wordpress/date"
      ),
    },
  },
};
