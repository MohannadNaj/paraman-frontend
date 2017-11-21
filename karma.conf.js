var files = ['node_modules/babel-polyfill/dist/polyfill.min.js', 'specs/setup/index.js','specs/**/*.spec.js'];

var OLD_NODE_ENV = process.env.NODE_ENV;
process.env.NODE_ENV = 'temp-require'
var webpackConfig = require('./node_modules/laravel-mix/setup/webpack.config.js');
delete webpackConfig.entry

process.env.NODE_ENV = OLD_NODE_ENV;

// karma.conf.js
module.exports = function (config) {
  var browsers =  ['PhantomJS'];

/*  if(process.env.NODE_ENV !== "testing")
    browsers.push('Chrome_custom');
*/
  config.set({
    browsers: browsers,
    customLaunchers: {
      PhantomJS_custom: {
        'base': 'PhantomJS',
        'options': {
          'viewportSize': {
            'width': 1920,
            'height': 1080
          },
        }
      },
      Chrome_custom: {
        base: 'Chrome',
        flags: ['--disable-gpu']
      }
    },

    frameworks: ['jasmine','moxios'],
    // this is the entry file for all our tests.
    files: files,

    // we will pass the entry file to webpack for bundling.
    preprocessors: {
      'specs/setup/index.js': ['webpack'],
      'specs/**/*.js': ['webpack']
    },
    // use the webpack config
    webpack: webpackConfig,
    // avoid walls of useless text
    webpackMiddleware: {
      noInfo: true,
      stats: 'errors-only'
    },
    colors: true,
    reporters: ['spec','notify'],
    notifyReporter: {
      reportEachFailure: true,
      reportSuccess: true,
    },
    specReporter: {
      suppressSkipped: true,
    },
    singleRun: process.env.NODE_ENV !== 'testing'
  })
}