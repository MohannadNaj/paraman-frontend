<template>
<div class="wrapper">
  <installer v-if="needInstallation"></installer>
  <div v-if="!needInstallation" class="sidebar parameters-sidebar--container">
      <div class="sidebar-wrapper">
          <div class="logo parameters-sidebar--logo">
              <img class="parameters-sidebar--logo__img rounded img-fluid" src="../../img/paraman-logo.png" alt="Paraman Logo">
              <a class="parameters-sidebar--logo__text simple-text">
                  Paraman
              </a>
          </div>
          <ul class="nav parameters-category--list">
              <parameters-category :ref="category.target + '_parameter_category'" :key="category.target + '_cat'" :title="category.title" :parameters="category.parameters" :is-categories-group="category.isCategoriesGroup" :blocked="category.blocked" :target="category.target"
                v-if="shouldShowCategory(category)" :related-parameter="category.relatedParameter" v-for="category in categories"></parameters-category>
              <li class="parameters-category--item">
                <a @click="toggleEditCategories"
                :class="['parameters-category--editCategory-button ', editCategoriesMode ? 'parameters-category--editCategory-button__active' : '']"
                href="javascript:void(0);">
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

import base from './mixins/parameters/base.js'

export default {
  mixins: [base],
  data() {
    return {
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
    'parameters-navbar': parametersNavbar,
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
    }
  }
}

</script>