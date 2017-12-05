<template>
  <div class="editor-boolean__container">
    <div class="editor-boolean__value-container" v-if="previewMode">
      <span class="editor-boolean__label" style="background: #eee;">{{ paramValue }}</span>
    </div>
    <div class="editor-boolean__input-container" v-if="!previewMode">
      <input type="checkbox" @keypress="submitIfEnter" class="editor-boolean__input editor-boolean__checkbox form-control editor" v-model="paramValue">
    </div>
  </div>
</template>

<script>

import EditorMixin from './../mixins/editors/base.js'

export default {
  mixins: [EditorMixin],
  mounted() {},
  methods: {
    submitIfEnter(event) {
      var keycode = event.keyCode ? event.keyCode : event.which

      if (keycode == 13) this.$parent.submit()
    }
  }
}

</script>