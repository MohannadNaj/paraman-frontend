window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

let token = document.head.querySelector('meta[name="csrf-token"]')

if (token) {
  window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content
}

window.Laravel = window.Laravel || {}
window.Laravel.components = window.Laravel.components || {}

require('./utils/EventBus')
require('./vue-components')
require('./tinymce-plugins')

