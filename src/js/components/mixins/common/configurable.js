module.exports = {
  computed: {
    showAddParameter() {
      if(window.Paraman.showAddParameter == null)
        return true

      return window.Paraman.showAddParameter
    },
    showRemoveParameter() {
      if(window.Paraman.showRemoveParameter == null)
        return true

      return window.Paraman.showRemoveParameter
    },
    showEditCategories() {
      if(window.Paraman.showEditCategories == null)
        return true

      return window.Paraman.showEditCategories
    },
    showPHPCode() {
      if(window.Paraman.showPHPCode == null)
        return true

      return window.Paraman.showPHPCode
    },
    showChangeCategory() {
      if(window.Paraman.showChangeCategory == null)
        return true

      return window.Paraman.showChangeCategory      
    }
  }
}
