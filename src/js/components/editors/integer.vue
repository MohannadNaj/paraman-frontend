<template>
  <div class="editor-integer__container">
    <div class="editor-integer__value-container" v-if="previewMode">
      <span class="editor-integer__label" style="background: #eee;">{{ paramValue }}</span>
    </div>
    <div class="editor-integer__input-container" v-if="!previewMode">
      <input type="number" class="editor-integer__input form-control editor" v-model="paramValue">
    </div>
  </div>
</template>

<script>

import EditorMixin from './../mixins/editors/base.js'

export default {
  mixins: [EditorMixin],
  mounted() {}
}

</script>