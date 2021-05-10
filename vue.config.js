const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  productionSourceMap: true,
  devServer: {
    port: 4200,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/api': {
        target: 'http://0.0.0.0:8080',
        ws: true,
        secure: false,
      },
      '/proxy': {
        target: 'http://0.0.0.0:8080',
        ws: true,
        secure: false,
      },
    }
  },
  configureWebpack: {
    devtool: 'source-map',
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  publicPath: '/ui/',
};
