<style>
.meta {
  background: #ccc;
  margin-top: 5px;
}

.meta-label {
  color: #626262;
}

.panel-title .btn {
  margin-top: -6px;
}
</style>
<template>
  <div>
    <div :class="['parameter','card',markIfDirty,'no-margin',customCssClass]">
      <div v-if="showHeader" class="parameter__header header">
        <parameter-header :original-parameter.sync="originalParameter"></parameter-header>
      </div>
      <div class="parameter__body content">
        <form class="parameter__form" v-if="originalParameter.type != null" v-on:submit.prevent="submit">
          <component :parameter="originalParameter" :is="getEditorComponentName" :ref="getEditorComponentRef"></component>
          <ul v-if="showErrors" class="parameter__list parameter__errors-container list-group" v-show="errors.length > 0">
            <li class="parameter__list-item parameter__list-item--danger list-group-item list-group-item-danger" v-for="error in errors" v-html="parseError(error)"></li>
          </ul>
        </form>
      </div>
      <div v-if="showFooter" class="parameter__footer footer">
        <parameter-meta :parameter.sync="originalParameter"></parameter-meta>
      </div>
    </div>
  </div>
</template>

<script>

import parameterMeta from './parameter-meta'
import editors from '../settings/editors'
import parameterHeader from './parameter-header'

export default {
  data() {
    return {
      isDirty: false,
      previewMode: true,
      errors: [],
      childComponent: null,
      originalParameter: window.Laravel.parametersColumns
    }
  },
  components: {
    'parameter-header': parameterHeader,
    'parameter-meta': parameterMeta,
    'editor-boolean': editors.boolean,
    'editor-file': editors.file,
    'editor-integer': editors.integer,
    'editor-text': editors.text,
    'editor-textfield': editors.textfield
  },
  props: {
    parameter: {
      default: function() {
        return window.Laravel.parametersColumns
      }
    }
  },
  mounted() {
    this.originalParameter = this.parameter

    this.registerEvents()
    this.$nextTick(x => {
      this.childComponent = this.$refs[
        this.originalParameter.id + 'editor-' + this.originalParameter.type
      ]
    })
  },
  methods: {
    removeParameter(event) {
      var eventConfirmationLevel = event.ctrlKey ? 'confirmed' : 'confirm'

      EventBus.fire(eventConfirmationLevel + '-removeParameter', this.parameter)
    },
    registerEvents() {
      EventBus.listen('value-change-' + this.parameter.id, data => {
        this.isDirty = data.isDirty
        this.errors = []
      })

      this.$on('file-uploaded', data => {
        if (this.parameter.type == 'file') this.parameterChanged(data.parameter)
      })

      this.$on('save-change', this.submit)
    },
    keyupLabelInput(event) {
      if (event.target.innerText.length > 255)
        event.target.innerText = event.target.innerText.substr(0, 255)

      if ((event.which || event.keyCode) == 13) {
        this.parameter.label = $.trim(event.target.innerText)
        event.target.innerText = this.parameter.label
        this.submitLabel()
      }
    },
    submitLabel() {
      this.submit(this.parameter.label)
    },
    submit(label = false) {
      let appendLabel = typeof label === 'string'

      if (!this.isDirty && !appendLabel) return null

      let requestParams = {
        value: this.childComponent.paramValue
      }

      if (typeof label === 'string') requestParams.label = label

      //      requestParams.label = this.parameter.label

      axios
        .patch(
          window.Laravel.base_url + 'parameters/' + this.originalParameter.id,
          requestParams
        )
        .then(response => {
          this.parameterChanged(response.data)
        })
        .catch(error => {
          var errorMessage =
            this.lang('parameter_response_error', this.parameter.id)
          var errorData = error.response.data
          if (typeof errorData == 'object') {
            this.errors = _.toArray(errorData)
          }
          Helper.checkCommonErrors(errorData, errorMessage)
        })
    },
    parameterChanged(parameter) {
      this.originalParameter = parameter
      this.$nextTick(x => {
        this.childComponent.init()
        this.isDirty = false
        if (!this.previewMode) this.togglePreview()
      })
      this.alert(
        this.lang('parameter_changed', parameter.label)
      )
      EventBus.fire('updated-parameter', parameter)
    },
    togglePreview() {
      this.childComponent.previewMode = !this.childComponent.previewMode
      this.previewMode = this.childComponent.previewMode
    },
    undoChanges() {
      this.childComponent.paramValue = this.childComponent.originalParameter.value
      this.childComponent.$emit('undo-changes')
      this.childComponent.focusInEditor()
    },
    parseError(error) {
      return error.join(', ')
    }
  },
  computed: {
    getEditorComponentName() {
      return 'editor-' + this.originalParameter.type
    },
    getEditorComponentRef() {
      return this.originalParameter.id + this.getEditorComponentName
    },
    markIfDirty() {
      return this.isDirty ? 'warning-bg' : 'default-bg'
    },
    customSettings() {
      return window.Laravel.components[this.getEditorComponentName] || {}
    },
    showHeader() {
      if(this.customSettings.header != null)
        return this.customSettings.header
      return true
    },
    showErrors() {
      if(this.customSettings.errors != null)
        return this.customSettings.errors
      return true
    },
    showFooter() {
      if(this.customSettings.footer != null)
        return this.customSettings.footer
      return true
    },
    customCssClass() {
      if(this.customSettings.cssContainer != null)
        return this.customSettings.cssContainer
      return ''
    }
  }
}

</script>