<template>
  <div class="wrapper">
    <installer v-if="needInstallation"></installer>
    <div v-if="!needInstallation" class="sidebar parameters-sidebar--container">
      <div class="sidebar-wrapper">
        <div class="logo parameters-sidebar--logo">
          <img class="parameters-sidebar--logo__img rounded img-fluid" src="../../img/paraman-logo.png" alt="Paraman Logo">
          <a class="parameters-sidebar--logo__text simple-text">
                  Paraman<br>{{version}}
              </a>
        </div>
        <ul class="nav parameters-category--list">
          <parameters-category :ref="category.target + '_parameter_category'" :key="category.target + '_cat'" :title="category.title" :parameters="category.parameters" :is-categories-group="category.isCategoriesGroup" :blocked="category.blocked" :target="category.target"
            v-if="shouldShowCategory(category)" :related-parameter="category.relatedParameter" v-for="category in categories"></parameters-category>
          <li class="parameters-category--item">
            <a @click="toggleEditCategories" :class="['parameters-category--editCategory-button ', editCategoriesMode ? 'parameters-category--editCategory-button__active' : '']" href="javascript:void(0);">
                  Edit Categories
                    <i class="fa fa-pencil"></i>
                </a>
          </li>
          <li class="note-container" v-if="categories.length <= 1">
            No Categories Found, Start by Adding one
            <add-category></add-category>
          </li>
        </ul>
      </div>
    </div>
    <div v-if="!needInstallation" class="main-panel">
      <parameters-navbar></parameters-navbar>
      <div class="content">
        <div class="container-fluid">
          <parameters-list ref="parameters"></parameters-list>
        </div>
      </div>
      <parameters-footer></parameters-footer>
    </div>
  </div>
</template>

<script>

import parametersCategory from './parameters-category'
import addCategory from './add-category'
import parametersList from './parameters-list'
import installer from './installer'
import parametersFooter from './parameters-footer'
import parametersNavbar from './parameters-navbar'
import _package from '../../../package.json'

export default {
  data() {
    return {
      version: _package.version,
      categories: [],
      parameters: [],
      openedCategory: null,
      categoriesParameters: [],
      editCategoriesMode: false,
      needInstallation: false
    }
  },
  components: {
    'parameters-category': parametersCategory,
    'add-category': addCategory,
    'parameters-list': parametersList,
    installer: installer,
    'parameters-footer': parametersFooter,
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
    enableEditCategoriesMode() {
      _.each(this.categories, category => {
        category.blocked = true
      })

      var categoriesCategory = _.find(this.categories, category => {
        return category.isCategoriesGroup
      })
      categoriesCategory.blocked = false
      this.$nextTick(x => {
        this.$refs[
          categoriesCategory.target + '_parameter_category'
        ][0].openCategory()
      })
    },
    disableEditCategoriesMode() {
      _.each(this.categories, category => {
        category.blocked = false
      })

      this.$nextTick(x => {
        this.openCategoryByHash(
          this.openedCategory == null || this.openedCategory == ''
            ? this.categories[0].target
            : this.openedCategory
        )
        EventBus.fire('disabled-editCategoriesMode')
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

      if (this.editCategoriesMode) this.enableEditCategoriesMode()
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
      return _.keys(this.$refs).filter(
        x => x.indexOf('_parameter_category') > -1
      )
    },
    deactivateCategories() {
      var categories = this.getCategoriesRefs()
      _.each(categories, categoryRef => {
        var category = this.$refs[categoryRef][0]
        if (category) category.deActivate()
      })
    },
    openCategory(data) {
      EventBus.fire('open-category', data)
      this.$refs[data.target + '_parameter_category'][0].activate()
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
        var categoryToOpen = this.$refs[hash + '_parameter_category'][0]

        if (categoryToOpen != undefined) return categoryToOpen.openCategory()
      }

      if (categories[0] == undefined) return EventBus.fire('open-addParameter')

      var categoryToOpen = this.$refs[categories[0]][0]

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
    },
    shouldShowCategory(category) {
      if (category.isCategoriesGroup) {
        if (this.editCategoriesMode) return true
        else return false
      }
      return true
    },
    toggleEditCategories() {
      this.editCategoriesMode = !this.editCategoriesMode
      if (!this.editCategoriesMode) return this.disableEditCategoriesMode()

      this.enableEditCategoriesMode()
    }
  }
}

</script>