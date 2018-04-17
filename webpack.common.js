var webpack = require("webpack");
var path = require("path");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var combineLoaders = require("webpack-combine-loaders");

module.exports = {

    context: path.resolve(__dirname, "src"),

    entry: {
        app: ["./index.js", "./electron-starter.js", "./electron-wait-react.js"]
    },

    target: "electron-main",

    node: {
        __dirname: false,
        __filename: false
    },

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
    ]
};