module.exports = {
  methods: {
    createdParameter(parameter) {
      this.parameters.push(parameter)
      this.loadParameters()
    },
    cancelRemoveParameter(parameter) {
      Helper.modal.hideModal()
    },
    confirmedRemoveParameter(parameter) {
      axios
        .delete(window.Laravel.base_url + 'parameters/' + parameter.id)
        .then(response => {
          var data = response.data

          var parameterIndex = this.parameters.indexOf(
            this.parameters.find(x => x.id == parameter.id)
          )
          this.parameters.splice(parameterIndex, 1)

          this.$nextTick(this.loadParameters)

          this.$nextTick(x => {
            EventBus.fire('update-parameters', this.parameters)
          })

          this.alert('Parameter (' + parameter.id + ') removed successfully')

          Helper.modal.hideModal()
        })
        .catch(error => {
          var errorMessage =
            'Error in removing parameter (' + parameter.id + ')'
          var errorData = error.response.data
          Helper.checkCommonErrors(errorData, errorMessage)
        })
    },
    confirmRemoveParameter(parameter) {
      var modal = Helper.modal

      var title = 'Remove parameter: ' + parameter.label

      modal.showComponent('remove-parameter', title)

      modal.showModalAfter(x => {
        // modal.setComponentData(parameter)
        var component = modal.$refs['component']
        component.parameter = parameter
      })
    }
  }
}
