'use strict'

const path = require('path')
const fs = require('fs')
const merge = require('webpack-merge')

const lessToJs = require('less-vars-to-js')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const webpack = require('webpack')

module.exports = (config = {}) => {
  return merge(config, {
    output: {
      filename: '[id].[name].js',
      chunkFilename: '[name].[chunkhash].js'
    },
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.less$/,
          // exclude: /node_modules/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                minimize: true
              }
            },
            {
              loader: 'less-loader',
              options: {
                modifyVars: lessToJs(fs.readFileSync(path.join(__dirname, './src/css/antd-overrides.less'), 'utf8')),
                javascriptEnabled: true
              }
            }
          ]
        },
        {
          test: /\.scss$|\.css$/,
          exclude: /node_modules/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                minimize: true,
                sourceMap: false
              }
            },
            'sass-loader'
          ]
        }
      ]
    },
    plugins: [
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new CleanWebpackPlugin('dist'),
      // new webpack.NamedModulesPlugin(),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment/),
      // new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|fr/),
      new MiniCssExtractPlugin({
        filename: 'style.[name].css',
        chunkFilename: 'css/[id].css'
      })
    ],
    resolve: {
      // extensions: ['.js', '.jsx', '.less'],
      alias: {
        'react': 'react/umd/react.production.min',
        'react-dom$': 'react-dom/umd/react-dom.production.min',
        'react-dom/server': 'react-dom/umd/react-dom-server.browser.production.min',
        'redux': 'redux/dist/redux.min',
        'react-router-dom': 'react-router-dom/umd/react-router-dom.min',
        'prop-types': 'prop-types/prop-types.min',
        // 'redux-saga': 'redux-saga/dist/redux-saga.min',
        // react-virtualized
        'react-virtualized/List': 'react-virtualized/dist/es/List',
        'react-virtualized/Grid': 'react-virtualized/dist/es/Grid',
        'react-virtualized/AutoSizer': 'react-virtualized/dist/es/AutoSizer',
        'react-virtualized/WindowScroller': 'react-virtualized/dist/es/WindowScroller',
        'react-virtualized/InfiniteLoader': 'react-virtualized/dist/es/InfiniteLoader',
        'moment$': 'moment/min/moment.min.js',
        'bluebird': 'bluebird/js/browser/bluebird.min',
        'immutable': 'immutable/dist/immutable.min',
        'react-transition-group$': 'react-transition-group/dist/react-transition-group',
        'axios': 'axios/dist/axios.min',
        'animate.css': 'animate.css/animate.min.css'
      }
    },
    devtool: false,
    optimization: {
      runtimeChunk: false,
      minimize: true,
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: false,
          uglifyOptions: {
            mangle: false,
            output: {
              comments: false
            }
          }
        }),
        new CompressionPlugin({
          asset: '[path].gz[query]',
          algorithm: 'gzip',
          test: /\.js$|\.css$|\.html$/,
          threshold: 10240,
          minRatio: 0
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {safe: true, discardComments: {removeAll: true}}
        })
        // new LodashModuleReplacementPlugin()
      ],
      splitChunks: {
        name: true,
        chunks: 'async',
        cacheGroups: {
          default: {
            chunks: 'initial',
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          },
          styles: {
            name: 'styles',
            test: /\.css$/,
            chunks: 'all',
            minChunks: 1,
            reuseExistingChunk: true,
            enforce: true
          }
        }
      }
    }
  })
}
