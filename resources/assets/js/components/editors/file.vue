<style scoped>
.fa {
  font-size: 50px;
}

.uploaded-img {
  max-width: 100%
}
</style>
<template>
  <div>
    <div>
      <img class="uploaded-img" v-if="isImage" :src="getImageSrc()" />
      <div v-else>
        <i class="fa fa-file-o"></i>
        <a :href="getImageSrc()">{{paramValue}}</a>
      </div>
    </div>
  </div>
</template>

<script>

import EditorMixin from './../mixins/editors/base.js'

export default {
  data() {
    return {
      dropzone_modal: '',
      lastTimeOpened: null,
    }
  },
  mixins: [EditorMixin],
  mounted() {
    this.dropzone_modal = Helper.dropzoneModal

    this.$on('file-uploaded', function(data) {
      this.paramValue = data.path
      this.$parent.$emit('file-uploaded', data)
      this.dropzone_modal.modal.modal('hide')
    })

    this.$on('previewMode-change', function(previewMode) {
      if (previewMode) return null

      if((parseInt((new Date).getTime() / 1000) - this.lastTimeOpened) < 3)
        return null

      this.$nextTick(x => {
        this.dropzone_modal.handlerInstance = this
        this.dropzone_modal.modal.modal('show')
        this.lastTimeOpened = parseInt((new Date).getTime() / 1000)
        this.dropzone_modal.modal.one('hide.bs.modal', () => {
          this.$parent.togglePreview()
        })
        this.dropzone_modal.header_msg = this.parameter.label
        this.dropzone_modal.additionalParams = {
          parameter: this.parameter.id
        }
      })
    })
  },
  computed: {
    isImage() {
      if (typeof this.paramValue != 'string') return null
      var imageTypes = ['jpg', 'jpeg', 'png', 'bmp', 'svg']
      return imageTypes.indexOf(this.paramValue.split('.').pop()) > -1
    }
  },
  methods: {
    getImageSrc() {
      return (
        window.Laravel.base_url +
        window.Laravel.images_dir +
        '/' +
        this.paramValue
      )
    }
  }
}

</script>