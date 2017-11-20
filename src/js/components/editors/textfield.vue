<template>
  <div>
    <div v-if="previewMode">
      <span style="background: #eee;">{{ paramValue }}</span>
    </div>
    <div v-if="!previewMode">
      <input type="text" class="form-control editor" v-model="paramValue">
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