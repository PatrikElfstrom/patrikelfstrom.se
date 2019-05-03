const path = require('path');
const webpack = require('webpack');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const structuredData = require('./structuredData.json');

module.exports = async (_, env) => {
  const isProd = env.mode === 'production';

  return {
    mode: isProd ? 'production' : 'development',
    entry: ['regenerator-runtime/runtime', './source/index.jsx'],
    devtool: isProd ? 'source-map' : 'inline-source-map',
    stats: isProd ? 'minimal' : 'normal',
    output: {
      filename: isProd ? '[name].[chunkhash:5].js' : '[name].js',
      chunkFilename: '[name].[chunkhash:5].js',
      path: path.join(__dirname, './dist'),
      publicPath: '/',
      globalObject: 'self',
    },
    resolve: {
      modules: ['source', 'node_modules'],
      extensions: ['.js', '.jsx', '.json', '.css'],
    },
    module: {
      rules: [
        {
          test: /\.(jsx|js)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: isProd ? '[hash:base64:5]' : '[local]__[hash:base64:5]',
                importLoaders: 1,
                sourceMap: true,
              },
            },
          ],
        },
        {
          test: /\.(xml|txt|webmanifest|png|ico|svg)$/,
          loader: 'file-loader',
          options: {
            context: path.resolve(__dirname, './source'),
            name: '[path][name].[ext]',
          },
        },
        {
          test: /\.(html)$/,
          loader: 'html-loader',
          options: {
            interpolate: true,
            attrs: ['link:href'],
          },
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: ['dist'],
      }),

      () => isProd && new webpack.optimize.SplitChunksPlugin({}),

      new HtmlWebpackPlugin({
        template: 'source/index.ejs',
        templateParameters: {
          host: 'patrikelfstrom.se',
          structuredData,
        },
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
        },
      }),
      new WorkboxPlugin.GenerateSW({
        swDest: 'sw.js',
        clientsClaim: true,
        skipWaiting: true,
      }),
    ],
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
      minimizer: [
        new TerserWebpackPlugin({
          sourceMap: isProd,
          terserOptions: {
            compress: {
              inline: 1,
            },
            mangle: {
              safari10: true,
            },
            output: {
              safari10: true,
            },
          },
        }),
      ],
    },
    node: {
      console: false,
      global: true,
      process: false,
      Buffer: false,
      setImmediate: false,
    },
    devServer: {
      hot: false,
      inline: false,
      port: 3000,
      historyApiFallback: true,
      proxy: {
        '/api': 'http://localhost:8080',
        cookieDomainRewrite: 'localhost',
      },
    },
  };
};
