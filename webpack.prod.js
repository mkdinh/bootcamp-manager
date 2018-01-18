const webpack = require("webpack");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
var path = require("path");

module.exports = merge(common, {
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist/static/js"),
    },

    devtool: "source-map",
    
    plugins: [
        new UglifyJSPlugin({
            sourceMap: true
        }),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("production")
        })
    ]
});