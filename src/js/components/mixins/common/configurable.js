let __paraman_config_checker = (prop) => {
  if(window.Paraman.editParametersOnly != null && window.Paraman.editParametersOnly)
    return false

  if(window.Paraman[prop] == null)
    return true

  return window.Paraman[prop]
}

module.exports = {
  computed: {
    showAddParameter() {
      return __paraman_config_checker('showAddParameter')
    },
    showRemoveParameter() {
      return __paraman_config_checker('showRemoveParameter')
    },
    showEditCategories() {
      return __paraman_config_checker('showEditCategories')
    },
    showPHPCode() {
      return __paraman_config_checker('showPHPCode')
    },
    showChangeCategory() {
      return __paraman_config_checker('showChangeCategory')
    },
    editableLabels() {
      if(window.Paraman.editableLabels == null)
        return __paraman_config_checker('editableLabels')

      return window.Paraman.editableLabels
    }
  }
}
