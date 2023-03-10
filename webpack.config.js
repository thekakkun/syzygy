const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.tsx",
  mode: "development",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist/"),
    publicPath: "/dist/",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: path.resolve(__dirname, "src"),
        loader: "babel-loader",
        options: { presets: ["@babel/env"] },
      },
      {
        test: /\.([cm]?ts|tsx)$/,
        include: path.resolve(__dirname, "src"),
        loader: "ts-loader",
        options: {
          compilerOptions: {
            noEmit: false,
          },
        },
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, "src"),
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: "[local]--[hash:base64:5]",
              },
            },
          },
          "postcss-loader",
        ],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
    extensionAlias: {
      ".js": [".js", ".ts"],
      ".cjs": [".cjs", ".cts"],
      ".mjs": [".mjs", ".mts"],
    },
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    static: path.join(__dirname, "public"),
    port: 3000,
  },
  devtool: "eval-cheap-module-source-map",
};
