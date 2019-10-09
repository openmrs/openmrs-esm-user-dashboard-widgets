const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;

module.exports = {
  entry: path.resolve(__dirname, "src/index.tsx"),
  output: {
    filename: "openmrs-esm-dashboard-widgets.js",
    libraryTarget: "system",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        parser: {
          system: false
        }
      },
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true
            }
          }
        ]
      },
      {
        test: /\.m?(js|ts|tsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  devtool: "sourcemap",
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    disableHostCheck: true
  },
  externals: ["react", "react-dom", /^@openmrs\/.*/],
  plugins: [new CleanWebpackPlugin()],
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"]
  }
};
