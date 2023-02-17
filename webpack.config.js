const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const webpack = require("webpack");

module.exports = {
  watch: true,
  mode: 'development',
  entry: {
    index: './src/scripts/index.js',
    ui: './src/scripts/ui.js',
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
      filename: 'index.html',
      template: './src/index.html',
    }),
    new HtmlWebpackPlugin({
      filename: 'search-results.html',
      template: './src/search-results.html',
    }),
    new HtmlWebpackPlugin({
      filename: 'master-bedrooms.html',
      template: './src/products/master-bedrooms.html',
    }),
    new HtmlWebpackPlugin({
      filename: 'kids-bedrooms.html',
      template: './src/products/kids-bedrooms.html',
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
      "crypto": false,
      "timers": false,
      "stream": false, 
      "fs": false,
      "http": false,
      "zlib": false,
    },
    extensions: ['.ts', '.js'],
  },
};
