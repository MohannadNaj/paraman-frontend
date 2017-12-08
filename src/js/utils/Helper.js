import lang from './../Lang'

window.Helper = new class {
  constructor() {
    this.vue = new Vue({ data: this.data, methods: this.methods })
    return this.vue
  }

  get data() {
    return {
      modal: null,
      dropzoneModal: null,
      modalElement: null
    }
  }

  get methods() {
    return {
      isTokenException(errorData) {
        return errorData.indexOf('TokenMismatchException') != -1
      },
      getTokenExceptionMessage() {
        return lang('token_mismatch_exception')
      },
      checkCommonErrors(
        errorData,
        errorMessage = '',
        showAlert = true,
        timeoutInSeconds = 20
      ) {
        if (typeof errorData == 'string') {
          if (this.isTokenException(errorData)) {
            errorMessage += this.getTokenExceptionMessage()
          }
        }
        if (showAlert)
          return this.alert(errorMessage, 'danger', timeoutInSeconds)

        return errorMessage
      }
    }
  }
}()
