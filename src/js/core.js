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
window.Dropzone = require('dropzone')

// TinyMCE
var tinymce = require('tinymce/tinymce')

// JsDiff
window.JsDiff = require('diff')

// Light-Bootstrap-Dashboard
require('../../third_party/light-bootstrap-dashboard/assets/js/chartist.min.js')
require('../../third_party/light-bootstrap-dashboard/assets/js/bootstrap-select.js')
require('../../third_party/light-bootstrap-dashboard/assets/js/bootstrap-notify.js')
require('../../third_party/light-bootstrap-dashboard/assets/js/light-bootstrap-dashboard.js')
