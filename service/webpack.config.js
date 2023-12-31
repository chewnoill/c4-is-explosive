const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const NodemonPlugin = require("nodemon-webpack-plugin");
const { DefinePlugin } = require("webpack");

module.exports = {
  target: "node",
  mode: "production",
  entry: {
    service: "./src/service.ts",
  },
  optimization: {
    minimize: false,
    minimizer: [new TerserPlugin()],
  },
  devtool: "cheap-source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".mjs", ".ts", ".tsx", ".js", ".jsx", ".md", ".json"],
    plugins: [],
  },
  plugins: [new NodemonPlugin(), new DefinePlugin({ "global.GENTLY": false })],
  node: {
    __dirname: true,
  },
};
