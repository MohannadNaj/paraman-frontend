module.exports = {
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
    }
  }
}
