module.exports = {
  methods: {
    updateCategoryParameter(parameter) {
      var index = this.parameters.findIndex(x => x.id == parameter.id)
      this.$set(this.parameters, index, parameter)
      this.prepareCategories()
    },
    choseParamCategory(data) {
      var parameter_id = data.parameter
      var category_id = data.category

      axios
        .post(
          window.Laravel.base_url +
            'parameters/' +
            parameter_id +
            '/category/' +
            category_id
        )
        .then(response => {
          var updatedParameter = response.data.parameter

          this.parameters = this.parameters.filter(
            x => x.id != updatedParameter.id
          )
          this.parameters.push(updatedParameter)

          this.loadParameters()
          this.$nextTick(y => {
            var newCategory = this.categories.find(x => x.target == category_id)
            var msg =
              'Parameter (' +
              updatedParameter.label +
              ') Moved successfully to category: ' +
              newCategory.title
            EventBus.fire('changed-paramCategory', {
              data: data,
              parameter: updatedParameter,
              ok: true
            })
            this.alert(msg)
          })
        })
        .catch(error => {
          var errorMessage =
            'Error in updating parameter (' + parameter_id + ')'
          var errorData = error.response.data
          Helper.checkCommonErrors(errorData, errorMessage)
          EventBus.fire('changed-paramCategory', { data: data, ok: false })
        })
    },
    changeParamCategory(data) {
      var modal = Helper.modal

      var title = 'Change Category for: ' + data.label

      modal.showComponent('change-paramCategory', title)

      modal.showModalAfter(x => {
        var component = modal.getComponent()
        // modal.setComponentData({parameter: data, categories: this.categories})

        component.parameter = data
        component.categories = this.categories

        // modal.getComponent().init()
        component.init()
      })
    }
  }
}
