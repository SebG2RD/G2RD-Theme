const path = require("path");

module.exports = {
  entry: {
    index: "./src/index.js",
    "typed-frontend": "./typed-frontend.js",
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].js",
    library: {
      type: "window",
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
    "@wordpress/blocks": ["wp", "blocks"],
    "@wordpress/block-editor": ["wp", "blockEditor"],
    "@wordpress/i18n": ["wp", "i18n"],
    "@wordpress/components": ["wp", "components"],
    "@wordpress/element": ["wp", "element"],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
};
