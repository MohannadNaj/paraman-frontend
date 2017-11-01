require('./core')
require('./bootstrap')

Vue.component('dropzone-upload', require('./components/dropzone-upload.vue'))
Vue.component('modal', require('./components/modal.vue'))

Vue.component('parameters', require('./components/parameters.vue'))

const app = new Vue({
  el: '#app',
  mounted() {
    Helper.modal = this.$refs['modal']
    Helper.dropzoneModal = this.$refs['dropzone-modal']

    if(window.Laravel.needInstallation)
    {
        EventBus.fire('need-installation')
    }

  }
})
