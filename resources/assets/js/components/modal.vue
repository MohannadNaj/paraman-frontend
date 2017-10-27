<style>
</style>
<template>
  <div>
    <!-- Modal -->
    <div class="modal fade" :id="data_id" tabindex="-1" role="dialog" :aria-labelledby="data_id + 'Label'">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" :aria-label="data_close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" :id="data_id + 'Label'">{{data_title}}</h4>
          </div>
          <div class="modal-body">
            {{data_body}}
            <div v-html="data_html"></div>
            <div v-if="data_showComponent">
              <component ref="component" :is="componentTag"></component>
            </div>
          </div>
          <div class="modal-footer" v-if="data_showFooter">
            <button type="button" class="btn btn-default" data-dismiss="modal">{{data_close}}</button>
            <button type="button" class="btn btn-primary" id="modal-submit" v-on:click="submit" data-dismiss="modal">{{data_save}}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import removeParameter from './remove-parameter'
import changeParamCategory from './change-paramCategory'
import addParameter from './add-parameter'
import addcategory from './add-category'

export default {
  data() {
    return {
      component: null,
      componentModel: null,
      componentTag: null,
      data_showComponent: false,
      window: window,
      data_body: '',
      data_close: '',
      data_id: '',
      data_save: '',
      data_title: '',
      data_html: '',
      data_showFooter: true
    }
  },
  components: {
    'remove-parameter': removeParameter,
    'change-paramCategory': changeParamCategory,
    'add-parameter': addParameter,
    'add-category': addcategory
  },
  mounted() {
    this.mapPropsToData()
    this.$nextTick(this.registerEvents)
  },
  props: {
    body: {
      default: ''
    },
    close: {
      default: 'Close'
    },
    id: {
      default: 'modal_id'
    },
    save: {
      default: 'Save'
    },
    title: {
      default: ''
    },
    html: {
      default: ''
    },
    showFooter: {
      default: true
    }
  },
  methods: {
    registerEvents() {
      this.matchBootstrapModalEvents()
    },
    matchBootstrapModalEvents() {
      ;['show', 'shown', 'hide', 'hidden'].forEach(event => {
        this.getModalElement().on(`${event}.bs.modal`, () => {
          EventBus.fire(`modal.${event}.bs.modal`, this.getModalElement())
        })
      })
    },
    submit() {
      EventBus.fire('modal-submit', this)
    },
    mapPropsToData() {
      this.data_body = this.body
      this.data_close = this.close
      this.data_id = this.id
      this.data_save = this.save
      this.data_title = this.title
      this.data_html = this.html
      this.data_showFooter = this.showFooter
    },
    cleanContent() {
      this.data_html = ''
      this.data_body = ''
      this.data_showComponent = false

      return this
    },
    getModalElementId() {
      return '#' + this.data_id
    },
    getModalElement() {
      return $(this.$el).find(this.getModalElementId())
    },
    getComponent() {
      return this.$refs['component']
    },
    setComponentData(data) {
      var component = this.getComponent()

      _.keys(data).forEach(key => {
        component[key] = data[key]
      })
    },
    showModal() {
      this.getModalElement().modal('show')
    },
    hideModal() {
      this.getModalElement().modal('hide')
    },
    showComponent(componentTag = null, title = null) {
      this.cleanContent()

      if (componentTag) this.componentTag = componentTag

      if (title) this.data_title = title

      this.data_showFooter = false
      this.data_showComponent = true

      this.hideComponentOnClose()

      return this
    },
    hideComponent() {
      this.data_showComponent = false
    },
    hideComponentOnClose() {
      this.getModalElement().one('hide.bs.modal', y => {
        this.hideComponent()
      })
    },
    showModalAfter(callback) {
      this.$nextTick(callback)
      this.showModal()
    }
  }
}

</script>