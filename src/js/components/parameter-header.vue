<template>
  <div>
    <h3 class="parameter__title-container title container-fluid">
      <div>
        <div :contenteditable="editableLabels && !previewMode" @keyup="keyupLabelInput" :class="['parameter__parameter-label', editableLabels && !previewMode ? 'parameter__parameter-label--editable':'']">{{originalParameter.label}}</div>
        <span class="parameter__controls-container pull-right">
                <span v-if="isDirty && previewMode" class="parameter__label parameter__label--unsaved label label-warning">
                    {{lang('parameter_header_unsaved_changes')}}
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
        <button @click="removeParameter" v-if="showRemoveParameter" type="button" class="parameter__button parameter__button--remove btn btn-danger btn-sm">
                    <i class="parameter__icon fa fa-times"></i>
                </button>
        </span>
        &nbsp;
      </div>
    </h3>
  </div>
</template>

<script>
import configurableMixin from './mixins/common/configurable'
export default {
  mixins: [configurableMixin],
  data() {
    return {}
  },
  props: {
    originalParameter: {
      default: () => {}
    }
  },
  computed: {
    isDirty() {
      return this.$parent.isDirty
    },
    previewMode() {
      return this.$parent.previewMode
    }
  },
  mounted() {},
  methods: {
    keyupLabelInput(...args) {
      return this.$parent.keyupLabelInput(...args)
    },
    undoChanges(...args) {
      return this.$parent.undoChanges(...args)
    },
    submit(...args) {
      return this.$parent.submit(...args)
    },
    togglePreview(...args) {
      return this.$parent.togglePreview(...args)
    },
    removeParameter(...args) {
      return this.$parent.removeParameter(...args)
    }
  }
}

</script>