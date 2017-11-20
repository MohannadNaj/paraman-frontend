<template>
  <div>
    <div class="modal fade" :id="modalId" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" :id="modalId + 'Label'">{{ header_msg }}</h4>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-xs-12">
                <form v-bind:action="target_action" id="dropzone-upload" class="text-center dropzone">
                </form>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            <button @click="saveBtn" type="button" class="btn btn-primary dropzone-upload--button__save">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import dropzone_settings from './../settings/dropzone-settings.js'

export default {
  data() {
    return {
      is_uploaded: false,
      path: null,
      window: window,
      handlerInstance: null,
      header_msg: '',
      target_action: window.Laravel.base_url + this._target,
      additionalParams: {},
      update_target: window.Laravel.base_url + this._update_target
    }
  },
  props: {
    _target: '',
    _update_target: '',
    modalId: {
      default: 'dropzone_upload'
    }
  },
  computed: {
    requestParams() {
      return _.merge(_.clone(this.additionalParams), {
        path: this.path
      })
    },
    modal() {
      return this.getModalElement()
    }
  },
  mounted() {
    this.init()
    this.matchBootstrapModalEvents()
  },
  methods: {
    matchBootstrapModalEvents() {
      ;['show', 'shown', 'hide', 'hidden'].forEach(event => {
        this.getModalElement().on(`${event}.bs.modal`, () => {
          EventBus.fire(`modal.${event}.bs.modal`, this.getModalElement())
        })
      })
    },
    getModalElement() {
      return $(this.$el).find(this.getModalElementId())
    },
    init() {
      dropzone_settings.handlerInstance = this
      window.Dropzone.options.dropzoneUpload = dropzone_settings
    },
    reinit() {
      this.init()
    },
    handleResponse(file, responseText) {
      if (typeof responseText.path != 'undefined') {
        this.path = responseText.path
        this.is_uploaded = true
      } else {
        this.is_uploaded = false
      }
    },
    saveBtn() {
      this.saveChanges()
    },
    getModalElementId() {
      return '#' + this.modalId
    },
    saveChanges() {
      if (!this.is_uploaded) return

      axios
        .post(this.update_target, this.requestParams)
        .then(response => {
          if (typeof response.data.path == 'undefined') return

          this.is_uploaded = false
          this.path = null
          if (this.handlerInstance != null) {
            this.handlerInstance.$emit('file-uploaded', response.data)
          }
          window.dropzone_instance.removeAllFiles()
          this.modal.modal('hide')
          this.modal.on('show.bs.modal', () => {
            this.reinit()
          })
        })
        .catch(error => {})
    }
  }
}

</script>