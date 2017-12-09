<template>
  <div class="parameters-sidebar__container sidebar-wrapper">
    <div class="parameters-sidebar__logo logo">
        <img class="parameters-sidebar__logo-img rounded img-fluid" src="../../img/paraman-logo.png" alt="Paraman Logo" v-if="logoImage.length == 0">
        <img class="parameters-sidebar__logo-img rounded img-fluid" :src="logoImage" v-if="logoImage.length != 0">
        <a v-if="logoText.length == 0" class="parameters-sidebar__logo-text simple-text">
            Paraman<br>{{version}}
        </a>
        <a v-if="logoText.length != 0" class="parameters-sidebar__logo-text simple-text" v-text="logoText"></a>
    </div>
    <ul class="parameters-sidebar__category-list nav">
      <parameters-category :ref="category.target + '_parameter_category'" :key="category.target + '_cat'" :title="category.title" :parameters="category.parameters" :is-categories-group="category.isCategoriesGroup" :blocked="category.blocked" :target="category.target"
        v-if="shouldShowCategory(category)" :related-parameter="category.relatedParameter" v-for="category in categories"></parameters-category>
      <li v-if="showEditCategories" class="parameters-sidebar__category-list-item parameters-sidebar__category-list-item--edit-categories">
        <a @click="toggleEditCategories" :class="['parameters-sidebar__button-category-edit', editCategoriesMode ? 'parameters-sidebar__button-category-edit--active' : '']" href="javascript:void(0);">
              {{lang('parameters_sidebar_button_edit_categories')}}
                <i class="parameters-sidebar__icon fa fa-pencil"></i>
            </a>
      </li>
      <li class="parameters-sidebar__category-list-item parameters-sidebar__category-list-item--not-found" v-if="categories.length <= 1">
        {{lang('parameters_sidebar_categories_not_found')}}
        <add-category></add-category>
      </li>
    </ul>
  </div>
</template>

<script>
import addCategory from './add-category'
import parametersCategory from './parameters-category'
import _package from '../../../package.json'
import configurableMixin from './mixins/common/configurable'

export default {
  mixins: [configurableMixin],
  components: {
    'add-category': addCategory,
    'parameters-category': parametersCategory,
  },
  data() {
    return {
      version: _package.version,
      editCategoriesMode: false,
      logoText: '',
      logoImage: ''
    }
  },
  props: {
    categories:  {
      type: Array,
      default: function () { return [] }
    }
  },
  mounted() {
    EventBus.listen('custom-logo', this.useCustomLogo)
  },
  methods: {
    useCustomLogo(data) {
      this.logoImage = data.image || ""
      this.logoText = data.text || ""
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
    },
    enableEditCategoriesMode() {
      _.each(this.$parent.categories, category => {
        category.blocked = true
      })

      var categoriesCategory = _.find(this.$parent.categories, category => {
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
      _.each(this.$parent.categories, category => {
        category.blocked = false
      })

      this.$nextTick(x => {
        this.$parent.openCategoryByHash(
          this.$parent.openedCategory == null || this.$parent.openedCategory == ''
            ? this.$parent.categories[0].target
            : this.$parent.openedCategory
        )
        EventBus.fire('disabled-editCategoriesMode')
      })
    }
  }
}
</script>