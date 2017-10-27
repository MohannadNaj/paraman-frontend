let Notify = require('vue-notifyjs')

// Merge Usage of Vue-Notifyjs into Vue, with default settings
Vue.use(Notify)
window.Vue.prototype.alert = function(
  msg,
  type = 'primary',
  timeoutInSeconds = 5,
  verticalAlign = 'bottom',
  horizontalAlign = 'right'
) {
  return this.$notify({
    verticalAlign: verticalAlign,
    horizontalAlign: horizontalAlign,
    timeout: 1000 * timeoutInSeconds,
    message: msg,
    type: type
  })
}
