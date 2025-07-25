const defaultConfig = require("@wordpress/scripts/config/webpack.config");

module.exports = {
  ...defaultConfig,
  entry: {
    index: "./src/index.js",
    "carousel-frontend": "./src/carousel-frontend.js",
  },
  externals: {
    ...defaultConfig.externals,
    swiper: "Swiper",
  },
};
