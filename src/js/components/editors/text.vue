<template>
  <div class="editor-text__container">
    <div class="editor-text__value-container" v-if="previewMode">
      {{ parseText(this.paramValue) }}
    </div>
    <div class="editor-text__input-container" v-show="!previewMode">
      <textarea :id="tinymceId" v-model="paramValue" class="editor-text__input editor-text__textarea editor form-control"></textarea>
    </div>
  </div>
</template>

<script>

import EditorMixin from './../mixins/editors/base.js'

export default {
  mixins: [EditorMixin],
  data() {
    return {
      paramValue: '',
      tinymceEditorInstance: null,
      tinymceId: null,
      tinymceSettings: require('./../../settings/tinymce-settings.js')
    }
  },
  mounted() {
    this.tinymceId = 'param_' + this.parameter.id
    this.$on('undo-changes', function() {
      this.tinymceEditorInstance.setContent(this.paramValue)
    })

    this.$on('previewMode-change', function(previewMode) {
      if (previewMode) {
        if (this.tinymceEditorInstance) this.tinymceEditorInstance.destroy()
        return null
      }

      this.$nextTick(x => {
        this.tinymceSettings.selector = '#' + this.tinymceId
        this.tinymceSettings.save_onsavecallback = this.save

        tinymce.init(this.tinymceSettings)

        this.tinymceEditorInstance = tinymce.get(this.tinymceId)
        this.tinymceEditorInstance.on('Change', x => {
          this.paramValue = this.tinymceEditorInstance.getContent()
        })
      })
    })
  },
  methods: {
    parseText(value) {
      return (
        value.substring(0, this.limitText) +
        (value.length > this.limitText ? ' ...' : '')
      )
    },
    save() {
      this.$parent.$emit('save-change')
      return false
    }
  }
}

</script>