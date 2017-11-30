<template>
  <div class="wrapper">
    <installer v-if="needInstallation"></installer>
    <div v-if="!needInstallation" class="sidebar parameters-sidebar--container">
      <parameters-sidebar ref="sidebar" :categories.sync="categories"></parameters-sidebar>
    </div>
    <div v-if="!needInstallation" class="main-panel">
      <parameters-navbar></parameters-navbar>
      <div class="content">
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
    extractCategoriesParameters() {
      var categoriesIds = _.map(this.categories, x => x.target)
      this.categoriesParameters = _.filter(this.parameters, parameter => {
        return categoriesIds.indexOf(parameter.id.toString()) != -1
      })

      _.each(this.categories, category => {
        category.parameters = _.filter(category.parameters, parameter => {
          return categoriesIds.indexOf(parameter.id.toString()) == -1
        })
      })

      this.categories.push({
        target: 'categories',
        blocked: false,
        title: 'Categories',
        parameters: this.categoriesParameters,
        isCategoriesGroup: true
      })
    },
    prepareCategories() {
      this.categories = []
      var categoriesKeys = _.keys(
        _.groupBy(
          this.parameters.filter(x => x.is_category != true),
          'category_id'
        )
      )

      var definedCategories = this.parameters.filter(x => x.is_category == true)

      _.forEach(definedCategories, cat => {
        if (categoriesKeys.indexOf(cat.id.toString()) == -1)
          categoriesKeys.push(cat.id.toString())
      })
      _.forEach(categoriesKeys, key => {
        this.categories.push(this.prepareCategory(key))
      })
      this.extractCategoriesParameters()

      this.$nextTick(() => {
        if (this.$refs['sidebar'].editCategoriesMode) this.$refs['sidebar'].enableEditCategoriesMode()
      })
    },
    prepareCategory(key) {
      if (key == 'null') key = null

      var preparedCategory = {}
      var categoryRelatedParameter = _.findLast(
        this.parameters,
        x => x.id == key
      )
      var title = ''

      if (
        categoryRelatedParameter == null ||
        categoryRelatedParameter.value.length == 0
      )
        title = 'Unnamed Category'
      else title = categoryRelatedParameter.value

      preparedCategory.isCategoriesGroup = false
      preparedCategory.blocked = false
      preparedCategory.title = title
      preparedCategory.target = key == null ? '' : key
      preparedCategory.parameters = _.filter(
        this.parameters,
        x => x.category_id == key
      )
      preparedCategory.relatedParameter = categoryRelatedParameter
      return preparedCategory
    },
    getCategoriesRefs() {
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

      if (categories.indexOf(hash + '_parameter_category') > -1) {
        var categoryToOpen = this.$refs['sidebar'].$refs[hash + '_parameter_category'][0]

        if (categoryToOpen != undefined) return categoryToOpen.openCategory()
      }

      if (categories[0] == undefined) return EventBus.fire('open-addParameter')

      var categoryToOpen = this.$refs['sidebar'].$refs[categories[0]][0]

      if (categoryToOpen != undefined) return categoryToOpen.openCategory()

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