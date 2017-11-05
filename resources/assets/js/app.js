require('./core')
require('./bootstrap')

Vue.component('paraman', require('./components/paraman.vue'))

const app = new Vue({
  el: '#app'
})
