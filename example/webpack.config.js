/** @type {import('webpack').Configuration} */
/* eslint-disable import/no-commonjs */

const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin")
const webpack = require("webpack")

module.exports = (_, { mode }) => ({
  entry: "./src/index.js",
  devServer: {
    server: "https",
    host: "0.0.0.0",
    hot: true
  },
  resolve: {
    alias: {
      three: path.resolve("./node_modules/three"),
      react: path.resolve("./node_modules/react"),
      "react-dom": path.resolve("./node_modules/react-dom"),
      "react-redux": path.resolve("./node_modules/react-redux"),
      "styled-components": path.resolve("./node_modules/styled-components"),
      "@react-three/fiber": path.resolve("./node_modules/@react-three/fiber"),
    },
  },
  plugins: [
    mode === "development" && new ReactRefreshWebpackPlugin(),
    new HtmlWebpackPlugin({ template: "src/index.html" }),
    new CopyPlugin({
      patterns: [
        { from: "data", to: "data" },
        { from: "node_modules/react-three-arnft/js", to: "js" },
        { from: "node_modules/@webarkit/jsartoolkit-nft/dist", to: "js" },
      ],
    }),
  ].filter(Boolean),
  devtool: mode === "development" ? "eval-source-map" : "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              plugins: [mode === "development" && "react-refresh/babel"].filter(
                Boolean,
              ),
            },
          },
        ],
      },
    ],
  },
})
