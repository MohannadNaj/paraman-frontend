<template>
  <div class="editor-textfield__container">
    <div class="editor-textfield__value-container" v-if="previewMode">
      <span style="background: #eee;">{{ paramValue }}</span>
    </div>
    <div class="editor-textfield__input-container" v-if="!previewMode">
      <input type="text" class="editor-textfield__input form-control editor" v-model="paramValue">
    </div>
  </div>
</template>

<script>

import EditorMixin from './../mixins/editors/base.js'

export default {
  mixins: [EditorMixin],
  mounted() {
    //
  },
  methods: {}
}

</script>