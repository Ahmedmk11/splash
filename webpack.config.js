const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const webpack = require("webpack");
const fs = require('fs');

module.exports = {
  watch: true,
  mode: 'development',
  entry: {
    index: './src/scripts/index.js',
    ui: './src/scripts/ui.js',
    splashDB: './src/scripts/splashDB.js',
  },
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: require.resolve('jquery'),
      jQuery: require.resolve('jquery')
    }),
    new HtmlWebpackPlugin({
      title: 'Home',
      template: './src/index.html'
    }),
    new FaviconsWebpackPlugin('./src/assets/images/icons/icn.png'),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  optimization: {
    runtimeChunk: 'single',
  },
  resolve: {
    fallback: {
      "util": require.resolve("util"),
      "crypto": require.resolve("crypto-browserify"),
      "timers": require.resolve("timers-browserify"),
      "stream": require.resolve("stream-browserify"),
      "fs": false
    },
    extensions: ['.ts', '.js'],
  },
};
