const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.tsx",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: ["@babel/env"] },
      },
      {
        test: /\.([cm]?ts|tsx)$/,
        exclude: "/node_modules",
        loader: "ts-loader",
        options: {
          compilerOptions: {
            noEmit: false,
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
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
  devServer: {
    static: path.join(__dirname, "public"),
    port: 3000,
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist/"),
    publicPath: "/dist/",
  },
};
