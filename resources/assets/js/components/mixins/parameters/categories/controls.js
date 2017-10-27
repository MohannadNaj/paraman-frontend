module.exports = {
  methods: {
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
      var categoriesKeys = _.keys(_.groupBy(this.parameters, 'category_id'))

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
    }
  }
}
