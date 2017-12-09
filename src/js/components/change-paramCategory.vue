<style scoped>
</style>
<template>
  <div class="change-category__container">
    <div v-if="showChangeCategory" class="change-category__list list-group">
      <button type="button" v-for="category in categories" v-if="!category.isCategoriesGroup" @click="choseCategory(category)" :class="['change-category__list-item','list-group-item', paramBelongsToCategory(category) ? 'change-category__list--success list-group-item-success':'']">
						<i :class="['change-category__icon','fa', paramBelongsToCategory(category) ? 'fa-check-square-o': 'fa-square-o']"></i>
						{{category.title}}
					</button>
      <div class="list-group-item change-category__list-item change-category__add-category-container">
        <add-category></add-category>
      </div>
    </div>
  </div>
</template>

<script>

import addCategory from './add-category'
import configurableMixin from './mixins/common/configurable'

export default {
  mixins: [configurableMixin],
  data() {
    return {
      parameter: window.Laravel.parametersColumns,
      categories: [],
      isBusy: false
    }
  },
  props: {},
  components: {
    'add-category': addCategory
  },
  methods: {
    init() {
      this.registerEvents()
    },
    registerEvents() {
      EventBus.listen('update-categories', this.updateCategories)
      EventBus.listen('changed-paramCategory', data => {
        this.isBusy = false
        if (!data.ok) return

        this.parameter = data.parameter
      })
      EventBus.listen('start-addCategory', x => {
        this.isBusy = true
      })
      EventBus.listen('end-addCategory', x => {
        this.isBusy = false
      })
    },
    updateCategories(categories) {
      this.categories = categories
    },
    paramBelongsToCategory(_category) {
      var paramCategoryId = this.parameter.category_id

      paramCategoryId = paramCategoryId == null ? '' : paramCategoryId

      return paramCategoryId == _category.target
    },
    choseCategory(category) {
      if (this.paramBelongsToCategory(category)) return null

      if (this.isBusy)
        return this.alert(
          this.lang('change_paramCategory_chose_busy'),
          'danger'
        )

      this.isBusy = true

      EventBus.fire('chose-paramCategory', {
        parameter: this.parameter.id,
        category: category.target
      })
    }
  },
  mounted() {
    this.init()
  },
  computed: {}
}

</script>