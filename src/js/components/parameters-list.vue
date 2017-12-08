<style scoped>
.parameters-list__list-item {
  padding: 0px;
  box-shadow: 0px 1px 2px black;
  margin-bottom: 20px;
}
</style>
<template>
  <div class="parameters-list container-fluid">
    <div class="row">
      <div class="col-md-12">
        <div v-if="parameters.length > 0" class="card">
          <div class="parameters-list__header header">
            <h4 class="parameters-list__title title">
              {{ title }}
              <span class="pull-right">
                <span class="parameters-list__badge badge">{{ parameters.length }}</span>
              <button type="button" class="parameters-list__button parameters-list__button--add btn btn-success btn-sm" @click="add">+</button>
              </span>
            </h4>
          </div>
          <div class="parameters-list__body content">
            <ul class="parameters-list__list list-group">
              <parameter class="parameters-list__list-item list-group-item" v-for="parameter in parameters" :parameter="parameter" :ref="'parameter'+parameter.id" :key="parameter.id"></parameter>
            </ul>
          </div>
        </div>
        <div class="parameters-list__add-container parameters-list__add-container--not-found" v-if="parameters.length == 0">
          <add-category v-if="isCategoriesGroup"></add-category>
          <div v-if="!isCategoriesGroup">
            {{lang('parameters_list_not_found')}}
            <add-parameter :category_id='category_id'></add-parameter>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import parameter from './parameter'
import addParameter from './add-parameter'
import addcategory from './add-category'

export default {
  data() {
    return {
      count: 0,
      title: '',
      category_id: '',
      isCategoriesGroup: false,
      parameters: []
    }
  },
  components: {
    parameter: parameter,
    'add-parameter': addParameter,
    'add-category': addcategory
  },
  mounted() {
    this.registerEvents()
  },
  methods: {
    add() {
      var modal = Helper.modal
      var componentTag, title

      if (this.isCategoriesGroup) {
        componentTag = 'add-category'
        title = 'Add category: '
      } else {
        componentTag = 'add-parameter'
        title = 'Add parameter: '
      }

      modal.showComponent(componentTag, title)

      modal.showModalAfter(x => {
        if (!this.isCategoriesGroup) {
          // review here
          var component = modal.$refs['component']
          component.data_category_id = this.category_id
        }
      })
    },
    created(parameter) {
      var modal = Helper.modal

      this.$nextTick(x => {
        modal.hideModal()
        this.alert(
          'Parameter ' + parameter.name + ' was just added succesfully'
        )
      })
    },
    registerEvents() {
      EventBus.listen('open-category', data => {
        this.title = data.title
        this.parameters = data.parameters
        this.category_id = data.target
        this.isCategoriesGroup = data.isCategoriesGroup
      })

      EventBus.listen('created-parameter', this.created)

      EventBus.listen('open-addParameter', this.openAddParameter)
      EventBus.listen('update-parameters', this.updateParameters)
    },
    updateParameters(parameters) {
      this.parameters = parameters
    },
    openAddParameter() {
      this.category_id = ''
      this.isCategoriesGroup = false
    }
  }
}

</script>