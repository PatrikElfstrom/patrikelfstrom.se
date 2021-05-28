const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = () => {
  const isEnvDevelopment = process.env.NODE_ENV !== 'production';
  const isEnvProduction = process.env.NODE_ENV === 'production';

  return {
    mode: process.env.NODE_ENV || 'development',
    devtool: isEnvProduction ? false : 'inline-source-map',
    entry: path.resolve(__dirname, './source/index.tsx'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      pathinfo: isEnvDevelopment,
      filename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].js'
        : 'static/js/[name].bundle.js',
      chunkFilename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].chunk.js'
        : 'static/js/[name].chunk.js',
      globalObject: 'this',
    },
    optimization: {
      minimize: isEnvProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
        }),
      ],
      splitChunks: {
        chunks: 'all',
      },
      runtimeChunk: true,
    },
    resolve: {
      extensions: ['.js', '.tsx', '.ts'],
    },
    module: {
      strictExportPresence: true,
      rules: [
        // Process application JS with Babel.
        {
          test: /\.(ts|tsx)$/,
          include: path.resolve(__dirname, 'source'),
          loader: 'babel-loader',
          options: {
            plugins: [isEnvDevelopment && 'react-refresh/babel'].filter(Boolean),
            cacheDirectory: true,
            cacheCompression: false,
            compact: isEnvProduction,
          },
        },
        // Process any JS outside of the app with Babel.
        {
          test: /\.(js|mjs)$/,
          exclude: /@babel(?:\/|\\{1,2})runtime/,
          loader: 'babel-loader',
          options: {
            babelrc: false,
            configFile: false,
            compact: false,
            cacheDirectory: true,
            cacheCompression: false,
            sourceMaps: isEnvDevelopment,
            inputSourceMap: isEnvDevelopment,
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'source', 'index.html'),
        minify: isEnvProduction && {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
      }),
      isEnvProduction && new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
      new ModuleNotFoundPlugin(path.resolve(__dirname, '.')),
      isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
      isEnvDevelopment && new ReactRefreshWebpackPlugin(),
      isEnvDevelopment && new CaseSensitivePathsPlugin(),
      new ForkTsCheckerWebpackPlugin({
        async: isEnvDevelopment,
      }),
      new ESLintPlugin({
        extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
      }),
      new CopyPlugin({
        patterns: [{ from: 'source/static' }],
      }),
    ].filter(Boolean),
    devServer: {
      contentBase: path.resolve(__dirname, 'source'),
    },
  };
};
