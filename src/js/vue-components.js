import lang from './LangManager'
import route from './RoutesManager'

// Merge Axios into Vue
window.Vue.prototype.$http = window.axios

// Merge Lang Manager into Vue
window.Vue.prototype.lang = lang

// Merge Route Manager into Vue
window.Vue.prototype.route = route

// Vue-Notifyjs
require('./utils/vue-notifyjs')
// Helpers
require('./utils/Helper')
