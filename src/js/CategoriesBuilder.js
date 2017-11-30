import _ from 'lodash'

export default class CategoriesBuilder {
  constructor (parameters) {
    this.categories = []
    this.parameters = parameters
  }

  getCategoriesKeysFromParameters() {
    return _.keys(
      _.groupBy(this.parameters.filter(x => x.is_category != true), 'category_id')
    )
  }

  getDefinedCategories() {
    return this.parameters.filter(x => x.is_category == true)
  }

  mergeCategoriesWithCategoriesIds(categoriesKeys, definedCategories) {
    categoriesKeys = categoriesKeys.map(x => x.toString())
    definedCategories = definedCategories.map(x => x.id.toString())

    return _.union(definedCategories, categoriesKeys)
  }

  buildCategoriesKeys() {
      // first, we will consider the `categories keys`, the keys that exist as a
      // an id for the "category_id" field of any parameter, we will consider
      // this keys as our primary wanted keys.
      let categoriesKeys = this.getCategoriesKeysFromParameters()

      // then we will add to the `categories keys` the defined categories that
      // doesn't have parameters. a defined category is a parameters defined
      // as category: `is_category=true`
      let definedCategories = this.getDefinedCategories()
      return this.mergeCategoriesWithCategoriesIds(categoriesKeys, definedCategories)
  }

  buildCategories() {
    this.categories = []

    let categoriesKeys = this.buildCategoriesKeys()

    _.forEach(categoriesKeys, key => {
      this.categories.push(this.prepareCategory(key))
    })
    this.extractCategoriesParameters()

    return this.categories
  }
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
  }

  extractCategoriesParameters() {
    let categoriesIds = _.map(this.categories, x => x.target)
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
  }
}
