module.exports = {
  computed: {
    showAddParameter() {
      if(window.Laravel.showAddParameter == null)
        return true

      return window.Laravel.showAddParameter
    },
    showRemoveParameter() {
      if(window.Laravel.showRemoveParameter == null)
        return true

      return window.Laravel.showRemoveParameter
    },
    showEditCategories() {
      if(window.Laravel.showEditCategories == null)
        return true

      return window.Laravel.showEditCategories
    },
    showPHPCode() {
      if(window.Laravel.showPHPCode == null)
        return true

      return window.Laravel.showPHPCode
    },
  }
}
