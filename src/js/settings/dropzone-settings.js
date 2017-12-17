import lang from '../LangManager'

export default {
  maxFiles: 1,
  handlerInstance: null,
  headers: {
    'X-CSRF-TOKEN': window.Paraman.csrfToken
  },

  init: function() {
    window.dropzone_instance = this

    this.on('maxfilesexceeded', function(file) {
      this.removeFile(file)
    })

    this.on('addedfile', function() {
      if (this.files[1] != null) {
        this.removeFile(this.files[0])
      }
    })
    this.on('success', function(file, responseText) {
      // success
      this.options.handlerInstance.handleResponse(file, responseText)
    })

    this.on('addedfile', function(file) {
      var removeButton = Dropzone.createElement(
        `<button class='btn btn-warning btn-sm'>${lang(
          'dropzone_upload_button_remove'
        )}</button>`
      )

      var _this = this

      removeButton.addEventListener('click', function(e) {
        e.preventDefault()
        e.stopPropagation()

        _this.removeFile(file)
      })

      file.previewElement.appendChild(removeButton)
    })
  }
}
