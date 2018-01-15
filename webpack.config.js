var webpack = require("webpack");
var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var combineLoaders = require("webpack-combine-loaders");
var FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");

module.exports = {
    entry: {
        app: ["./src/index.js"]
    },

    output: {
        path: __dirname + "./src/built",
        filename: "bundle.js",
        publicPath: "http://localhost:8080/built/"
    },

    target: "electron-main",

    node: {
        __dirname: false,
        __filename: false
      },

    devServer: {
        contentBase: "./public",
        publicPath: "http://localhost:8080/built/"
    },

    devtool: "inline-cheap-module-source-map",

    module: {
        loaders: [
            { 
                test: /\.js$/, 
                loaders: ["react-hot-loader/webpack",'babel-loader'], 
                exclude: /node_modules/,
                include: [path.resolve(__dirname, "./src")] 
            },
            { 
                test: /\.css$/, 
                loaders: [
                'style-loader?sourceMap',
                'css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]'
                ]
            },
            { 
                test: /\.jsx?$/, 
                loader: "babel-loader", 
                exclude: /node_modules/, 
                query: { presets: ["react"] } 
            }
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new FriendlyErrorsWebpackPlugin()
        // ignore any fs or ipc modules
        // new webpack.IgnorePlugin(new RegExp("^(fs|ipc)$")),
 
    ]
};