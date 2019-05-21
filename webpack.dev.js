const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const path = require("path");

module.exports = merge(common, {
  output: {
    filename: "bundle.js",
    publicPath: "http://localhost:8080/built",
    path: path.resolve(__dirname, "built")
  },

  devServer: {
    contentBase: path.resolve(__dirname, "public")
  },

  devtool: "inline-cheap-module-source-map",
  plugins: [new FriendlyErrorsWebpackPlugin()]
});
