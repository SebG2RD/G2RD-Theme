const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  ...defaultConfig,
  entry: {
    index: "./src/index.js",
    "portfolio-universel-frontend": "./src/portfolio-universel-frontend.js",
  },
  plugins: [
    ...defaultConfig.plugins,
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
  ],
};
