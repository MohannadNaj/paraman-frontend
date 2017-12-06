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
    <div :class="['parameter','card',markIfDirty,'no-margin']">
      <div class="parameter__header header">
        <h3 class="parameter__title-container title container-fluid">
          <div>
            <div :contenteditable="!previewMode" @keyup="keyupLabelInput" :class="['parameter__parameter-label', !previewMode ? 'parameter__parameter-label--editable':'']">{{originalParameter.label}}</div>
            <span class="parameter__controls-container pull-right">
                <span v-if="isDirty && previewMode" class="parameter__label parameter__label--unsaved label label-warning">
                    Unsaved Changes!
                </span>
            <button v-if="isDirty && !previewMode" @click="undoChanges" type="button" class="parameter__button parameter__button--undo btn btn-default btn-sm">
                    <i class="parameter__icon fa fa-undo"></i>
                </button>
            <button v-if="isDirty && !previewMode" @click="submit" type="button" class="parameter__button parameter__button--save btn btn-default btn-sm">
                    <i class="parameter__icon fa fa-floppy-o"></i>
                </button>
            <span class="parameter__badge badge">{{originalParameter.type}}</span>
            <button @click="togglePreview" type="button" class="parameter__button parameter__button--edit btn btn-default btn-sm">
                    <i class="parameter__icon fa fa-pencil"></i>
                </button>
            <button @click="removeParameter" type="button" class="parameter__button parameter__button--remove btn btn-danger btn-sm">
                    <i class="parameter__icon fa fa-times"></i>
                </button>
            </span>
            &nbsp;
          </div>
        </h3>
      </div>
      <div class="parameter__body content">
        <form class="parameter__form" v-if="originalParameter.type != null" v-on:submit.prevent="submit">
          <component :parameter="originalParameter" :is="getEditorComponentName" :ref="getEditorComponentRef"></component>
          <ul class="parameter__list parameter__errors-container list-group" v-show="errors.length > 0">
            <li class="parameter__list-item parameter__list-item--danger list-group-item list-group-item-danger" v-for="error in errors" v-html="parseError(error)"></li>
          </ul>
        </form>
      </div>
      <div class="parameter__footer footer">
        <parameter-meta :parameter.sync="originalParameter"></parameter-meta>
      </div>
    </div>
  </div>
</template>

<script>

import parameterMeta from './parameter-meta'
import editorBoolean from './editors/boolean'
import editorFile from './editors/file'
import editorInteger from './editors/integer'
import editorText from './editors/text'
import editorTextfield from './editors/textfield'

export default {
  data() {
    return {
      isDirty: false,
      errors: [],
      previewMode: true,
      childComponent: null,
      originalParameter: window.Laravel.parametersColumns
    }
  },
  components: {
    'parameter-meta': parameterMeta,
    'editor-boolean': editorBoolean,
    'editor-file': editorFile,
    'editor-integer': editorInteger,
    'editor-text': editorText,
    'editor-textfield': editorTextfield
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
            'Error in updating parameter (' + this.parameter.id + ')'
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
        'Parameter: ' + parameter.label + ' has been updated successfully'
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
    }
  }
}

</script>