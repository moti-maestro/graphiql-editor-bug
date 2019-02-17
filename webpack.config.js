'use strict'

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const webpack = require('webpack')

// envs
const getCommonConfig = require('./webpack.config.common')
const getProdConfig = require('./webpack.config.prod')
const getDevConfig = require('./webpack.config.dev')

const isDev = String(process.env.NODE_ENV).toLowerCase().startsWith('dev')

const getParsedConfig = (env) => {
  return {
    'production': getProdConfig,
    'development': getDevConfig
  }[env] || getProdConfig
}

module.exports = (env, args) => {
  console.info(`
    Running with:\n
     - mode: ${isDev ? 'Development' : 'Production'}\n
     - api: ${process.env['API'] || ''}\n
     - path: ${process.env['API_PATH'] || ''}\n
     - ssl: ${process.env['SSL'] || 'false'}
  `)

  return getParsedConfig(isDev ? 'development' : 'production')(getCommonConfig(), env, args)
}
