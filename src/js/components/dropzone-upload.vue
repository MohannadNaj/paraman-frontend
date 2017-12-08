<template>
  <div>
    <div class="dropzone-upload modal fade" :id="modalId" tabindex="-1" role="dialog">
      <div class="dropzone-upload__container modal-dialog" role="document">
        <div class="modal-content">
          <div class="dropzone-upload__header modal-header">
            <button type="button" class="dropzone-upload__close close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="dropzone-upload__title modal-title" :id="modalId + 'Label'">{{ header_msg }}</h4>
          </div>
          <div class="dropzone-upload__body modal-body">
            <div class="row">
              <div class="col-xs-12">
                <form v-bind:action="target_action" id="dropzone-upload" class="dropzone-upload__form text-center dropzone">
                </form>
              </div>
            </div>
          </div>
          <div class="dropzone-upload__footer modal-footer">
            <button type="button" class="dropzone-upload__button dropzone-upload__button--close btn btn-default" data-dismiss="modal">{{lang('close')}}</button>
            <button @click="saveBtn" type="button" class="dropzone-upload__button dropzone-upload__button--action dropzone-upload__button--submit btn btn-primary">{{lang('save_changes')}}</button>
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