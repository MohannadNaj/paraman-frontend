import lang from './LangManager'

// Merge Axios into Vue
window.Vue.prototype.$http = window.axios

// Merge Lang Manager into Vue
window.Vue.prototype.lang = lang


// Vue-Notifyjs
require('./utils/vue-notifyjs')
// Helpers
require('./utils/Helper')
