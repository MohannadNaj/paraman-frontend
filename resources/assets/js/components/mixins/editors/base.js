module.exports = {
  data() {
    return {
      /* allow us to call window objects, if needed,
			 inside vue templates, as:
			 <li>{{window.someGlobalObjectShouldNotBeCalledLikeThis}}</li> */
      window: window,
      previewMode: true,
      limitText: 100,
      originalParameter: {},
      paramValue: null,
      isDirty: false
    }
  },
  mounted() {
    this.init()
  },
  props: {
    parameter: {
      default: x => {
        return {}
      }
    }
  },
  methods: {
    init() {
      this.originalParameter = this.parameter
      this.paramValue = this.originalParameter.value
      this.isDirty = false
    },
    focusInEditor() {
      $(this.$el)
        .find('.editor')
        .select()
    }
  },
  watch: {
    previewMode(newValue) {
      if (!newValue) this.$nextTick(this.focusInEditor)

      this.$emit('previewMode-change', newValue)
    },
    paramValue(newValue) {
      if (newValue == this.originalParameter.value) {
        this.isDirty = false
      } else {
        this.isDirty = true
      }
      EventBus.fire('value-change-' + this.originalParameter.id, {
        isDirty: this.isDirty,
        newValue: newValue
      })
    }
  }
}
