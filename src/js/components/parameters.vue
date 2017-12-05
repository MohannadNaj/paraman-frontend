<template>
  <div class="parameters__container wrapper">
    <installer v-if="needInstallation"></installer>
    <div v-if="!needInstallation" class="sidebar parameters__sidebar-container">
      <parameters-sidebar ref="sidebar" :categories.sync="categories"></parameters-sidebar>
    </div>
    <div v-if="!needInstallation" class="parameters__main main-panel">
      <parameters-navbar></parameters-navbar>
      <div class="parameters__body content">
        <div class="container-fluid">
          <parameters-list ref="parameters"></parameters-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import parametersList from './parameters-list'
import parametersSidebar from './parameters-sidebar'
import installer from './installer'
import CategoriesBuilder from './../CategoriesBuilder'
import parametersNavbar from './parameters-navbar'

export default {
  data() {
    return {
      categories: [],
      parameters: [],
      openedCategory: null,
      categoriesParameters: [],
      needInstallation: false
    }
  },
  components: {
    'parameters-sidebar': parametersSidebar,
    'parameters-list': parametersList,
    installer: installer,
    'parameters-navbar': parametersNavbar
  },
  mounted() {
    this.parameters = this.parametersList
    this.registerEvents()
    this.loadParameters()
  },
  props: {
    parametersList: null
  },
  methods: {
    loadParameters() {
      this.prepareCategories()
      this.$nextTick(this.openCategoryByHash)
    },
    registerEvents() {
      EventBus.listen('need-installation', () => {
        this.needInstallation = true
      })
      EventBus.listen('opening-category', data => {
        this.deactivateCategories()
        this.openCategory(data)
      })
      EventBus.listen('change-paramCategory', this.changeParamCategory)
      EventBus.listen('chose-paramCategory', this.choseParamCategory)
      EventBus.listen('created-category', this.createdCategory)
      EventBus.listen('updated-parameter', this.updateCategoryParameter)
      EventBus.listen('created-parameter', this.createdParameter)
      EventBus.listen('confirm-removeParameter', this.confirmRemoveParameter)
      EventBus.listen('cancel-removeParameter', this.cancelRemoveParameter)
      EventBus.listen(
        'confirmed-removeParameter',
        this.confirmedRemoveParameter
      )
    },
    createdParameter(parameter) {
      this.parameters.push(parameter)
      this.loadParameters()
    },
    cancelRemoveParameter(parameter) {
      Helper.modal.hideModal()
    },
    confirmedRemoveParameter(parameter) {
      axios
        .delete(window.Laravel.base_url + 'parameters/' + parameter.id)
        .then(response => {
          var data = response.data

          var parameterIndex = this.parameters.indexOf(
            this.parameters.find(x => x.id == parameter.id)
          )
          this.parameters.splice(parameterIndex, 1)

          this.$nextTick(this.loadParameters)

          this.$nextTick(x => {
            EventBus.fire('update-parameters', this.parameters)
          })

          this.alert('Parameter (' + parameter.id + ') removed successfully')

          Helper.modal.hideModal()
        })
        .catch(error => {
          var errorMessage =
            'Error in removing parameter (' + parameter.id + ')'
          var errorData = error.response.data
          Helper.checkCommonErrors(errorData, errorMessage)
        })
    },
    confirmRemoveParameter(parameter) {
      var modal = Helper.modal

      var title = 'Remove parameter: ' + parameter.label

      modal.showComponent('remove-parameter', title)

      modal.showModalAfter(x => {
        // modal.setComponentData(parameter)
        var component = modal.$refs['component']
        component.parameter = parameter
      })
    },
    prepareCategories() {
      let categoriesBuilder = new CategoriesBuilder(this.parameters)
      this.categories = categoriesBuilder.buildCategories()

      this.$nextTick(() => {
        if (typeof this.$refs['sidebar'] != "undefined" &&
          this.$refs['sidebar'].editCategoriesMode)
          this.$refs['sidebar'].enableEditCategoriesMode()
      })
    },
    getCategoriesRefs() {
      if(typeof this.$refs['sidebar'] == "undefined")
        return []

      return _.keys(this.$refs['sidebar'].$refs).filter(
        x => x.indexOf('_parameter_category') > -1
      )
    },
    deactivateCategories() {
      var categories = this.getCategoriesRefs()
      _.each(categories, categoryRef => {
        var category = this.$refs['sidebar'].$refs[categoryRef][0]
        if (category) category.deActivate()
      })
    },
    openCategory(data) {
      EventBus.fire('open-category', data)
      this.$refs['sidebar'].$refs[data.target + '_parameter_category'][0].activate()
      window.location.hash = data.target
      var categoriesCategory = _.find(this.categories, category => {
        return category.isCategoriesGroup
      })
      if (data.target != categoriesCategory.target)
        this.openedCategory = data.target
    },
    openCategoryByHash(hash = null) {
      if (hash == null) hash = window.location.hash.substr(1)

      var categories = this.getCategoriesRefs()

      // if we found the hash category in the references, open it and stop
      if (categories.indexOf(hash + '_parameter_category') > -1) {
        // since "..._parameter_category" refs in the "parameters-list"
        // was in a for loop, it will return array and should be retrieved by
        // the key. but we will get the first one only.
        var categoryToOpen = this.$refs['sidebar'].$refs[hash + '_parameter_category'][0]

        if (categoryToOpen != undefined) return categoryToOpen.openCategory()
      }

      // if the hash category is not found, and there is no categories at all.
      // open add parameter
      if (categories[0] == undefined) return EventBus.fire('open-addParameter')

      // if the hash category is not found, but there is categories, open the
      // first category.
      var categoryToOpen = this.$refs['sidebar'].$refs[categories[0]][0]

      if (categoryToOpen != undefined) return categoryToOpen.openCategory()

      // if the hash category is not found, and the first category is not
      // defined correctly, but we know there is categories, open add parameter
      return EventBus.fire('open-addParameter')
    },
    createdCategory(data) {
      this.parameters.push(data)
      this.$nextTick(x => {
        this.prepareCategories()
        this.$nextTick(y => {
          EventBus.fire('update-categories', this.categories)
        })
      })
    },
    updateCategoryParameter(parameter) {
      var index = this.parameters.findIndex(x => x.id == parameter.id)
      this.$set(this.parameters, index, parameter)
      this.prepareCategories()
    },
    choseParamCategory(data) {
      var parameter_id = data.parameter
      var category_id = data.category

      axios
        .post(
          window.Laravel.base_url +
            'parameters/' +
            parameter_id +
            '/category/' +
            category_id
        )
        .then(response => {
          var updatedParameter = response.data.parameter

          this.parameters = this.parameters.filter(
            x => x.id != updatedParameter.id
          )
          this.parameters.push(updatedParameter)

          this.loadParameters()
          this.$nextTick(y => {
            var newCategory = this.categories.find(x => x.target == category_id)
            var msg =
              'Parameter (' +
              updatedParameter.label +
              ') Moved successfully to category: ' +
              newCategory.title
            EventBus.fire('changed-paramCategory', {
              data: data,
              parameter: updatedParameter,
              ok: true
            })
            this.alert(msg)
          })
        })
        .catch(error => {
          var errorMessage =
            'Error in updating parameter (' + parameter_id + ')'
          var errorData = error.response.data
          Helper.checkCommonErrors(errorData, errorMessage)
          EventBus.fire('changed-paramCategory', {
            data: data,
            ok: false
          })
        })
    },
    changeParamCategory(data) {
      var modal = Helper.modal

      var title = 'Change Category for: ' + data.label

      modal.showComponent('change-paramCategory', title)

      modal.showModalAfter(x => {
        var component = modal.getComponent()
        // modal.setComponentData({parameter: data, categories: this.categories})

        component.parameter = data
        component.categories = this.categories

        // modal.getComponent().init()
        component.init()
      })
    }
  }
}

</script>