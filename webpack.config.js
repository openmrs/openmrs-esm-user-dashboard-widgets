const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: path.resolve(__dirname, "src/index.tsx"),
  output: {
    filename: "openmrs-esm-user-dashboard-widgets.js",
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
        exclude: [/src/],
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: false
            }
          }
        ]
      },
      {
        test: /\.css$/i,
        exclude: [/node_modules/],
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
      },
      {
        test: /\.(woff2|woff|ttf|eot|svg|png)?$/,
        use: ["file-loader"]
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
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([{ from: "src/images", to: "images" }])
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"]
  }
};
