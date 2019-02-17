'use strict'

const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const merge = require('webpack-merge')

const lessToJs = require('less-vars-to-js')

const port = 3100

module.exports = (config = {}) => {
  return merge(config, {
    entry: {
      main: [
        `webpack-dev-server/client?http://localhost:${port}`,
        'webpack/hot/dev-server'
      ]
    },
    module: {
      rules: [
        {
          test: /\.scss$|\.css$/,
          exclude: /node_modules/,
          // include: 'node_modules/codemirror-graphql',
          use: [
            'style-loader',
            {
              loader: 'style-loader' // creates style nodes from JS strings
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              } // translates CSS into CommonJS
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              } // compiles Sass to CSS
            }
          ]
        },
        {
          test: /\.less$/,
          use: [
            'style-loader',
            {
              loader: 'style-loader' // creates style nodes from JS strings
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'less-loader',
              options: {
                sourceMap: true,
                javascriptEnabled: true
              }
            }
          ]
        }
      ]
    },
    plugins: [
      // enables hot replacement for modules
      new webpack.HotModuleReplacementPlugin()
    ],
    devtool: 'eval-source-map',
    mode: 'development',
    devServer: {
      contentBase: './src',
      publicPath: '',
      hot: true,
      host: '0.0.0.0',
      disableHostCheck: true,
      historyApiFallback: true,
      compress: false, // compress only on production
      port: port,
      stats: {
        assets: true,
        children: false,
        chunks: false,
        hash: false,
        modules: false,
        publicPath: false,
        timings: true,
        version: false,
        warnings: true
      }
    }
  })
}
