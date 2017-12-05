<template>
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
</template>

<script>
import addCategory from './add-category'
import parametersCategory from './parameters-category'
import _package from '../../../package.json'

export default {
  components: {
    'add-category': addCategory,
    'parameters-category': parametersCategory,
  },
  data() {
    return {
      version: _package.version,
      editCategoriesMode: false
    }
  },
  props: {
    categories:  {
      type: Array,
      default: function () { return [] }
    }
  },
  mounted() {
    
  },
  methods: {
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