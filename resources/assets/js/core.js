// Lodash
window._ = require('lodash')

// jQuery & Bootstrap
try {
  window.$ = window.jQuery = require('jquery')

  require('bootstrap-sass')
} catch (e) {}

// Axios
window.axios = require('axios')

// Vue
window.Vue = require('vue')

// Dropzone
window.Dropzone = require('./libs/dropzone.min')

// TinyMCE
var tinymce = require('tinymce/tinymce')

// JsDiff
window.JsDiff = require('diff')
