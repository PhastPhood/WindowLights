'use strict'

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, './admin/index.tsx'),

  output: {
    path: path.resolve(__dirname, './dist/admin'),
    filename: 'bundle.js'
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: 'source-map',

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js']
  },

  module: {
    rules: [

      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.tsx?$/, use: ['awesome-typescript-loader'], exclude: /node_modules/ },
      { 
        test: /\.scss$/,
        use: [
            'style-loader',
            {loader: 'css-loader', options: {sourceMap: true, importLoaders: 2}},
            {loader: 'postcss-loader', options: {sourceMap: true}},
            {loader: 'sass-loader', options: {sourceMap: true}}],
        exclude: /node_modules/
      },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader', exclude: /node_modules/ }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'admin/index.html'
    })
  ]
};