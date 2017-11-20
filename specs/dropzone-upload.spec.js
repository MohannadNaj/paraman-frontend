import dropzoneUpload from '../src/js/components/dropzone-upload'

describe('dropzone-upload Component', () => {
  
  beforeEach(()=> commonBeforeEach(dropzoneUpload))

  afterEach(commonAfterEach)

  it(`has a handleResponse method`, () => {
    createVue()

    expect(typeof vm.handleResponse)
    .toBe('function')
  })

  it(`default the handler instance to null`, () => {
    createVue()
    expect(vm.handlerInstance)
    .toBeFalsy()
  })

  it(`interact with dropzone through the global 'window'`, (done) => {

    createVue()

    spy('handleResponse')

    $(vm.$el).find('.dropzone').dropzone()

    window.dropzone_instance.emit('success', {}, {})

    expect(vm.handleResponse.calledOnce)
    .toBe(true)

    then(() => {
      done()
    })
  })

  it('is_uploaded is true on success', (done) => {

    createVue()

    spy('handleResponse')

    $(vm.$el).find('.dropzone').dropzone()

    expect(vm.is_uploaded).toBe(false)

    window.dropzone_instance.emit('success', {}, {path:''})

    expect(vm.is_uploaded).toBe(true)
    expect(vm.handleResponse.calledOnce).toBe(true)
    done()
  })

  it('modal still open if changes is saved without successful upload', (done) => {
    createVue()
    spy('saveChanges')
    vm.modal.modal('show')

    EventBus.listen('modal.shown.bs.modal', () => {
      expect(vm.saveChanges.calledOnce).toBe(true)
      expect(vm.is_uploaded).toBe(false)

      setTimeout(() => {
        notExpectEvent('modal.hide.bs.modal')
        done()
      }, 10)
    })

    vm.$el.querySelector('.dropzone-upload--button__save').click()
  })

  it('on successful upload: hide modal', (done) => {
    createVue()

    EventBus.listen('modal.shown.bs.modal', () => {
      moxios.wait(() => {
        then(()=> {
          expectEvent('modal.hide.bs.modal')
          expect(vm.modal.attr('class')).not.toContain('in')
          done()
        })
      })
      submitSuccessfulUpload()
    })

    vm.modal.modal('show')
  })

  it('on successful upload: reset data', (done) => {
    createVue()

    submitSuccessfulUpload()

    moxios.wait(() => {
      then(()=> {
        expect(vm.is_uploaded).toBeFalsy()
        expect(vm.path).toBeFalsy()
        done()
      })
    })
  })

  it('after successful upload: re initiate if the modal is opened again', (done) => {
    // Arrange
    createVue()

    spy('reinit', vm)

    // Assert
    let assertion = () => {
      EventBus.listen('modal.shown.bs.modal', () => {
        expect(vm.reinit.called).toBe(true)
        done()
      })

      vm.modal.modal('show')
    }

    submitSuccessfulUpload()
    // Act
    moxios.wait(() => {
      assertion()
    })
  })

  it(`after successful upload: emit 'file-uploaded' event if there is a handler instance`, (done) => {
    // Arrange
    createVue()

    vm.handlerInstance = EventBus

    spy('$emit', EventBus)

    EventBus.listen('file-uploaded', () => {
      expect(EventBus.$emit.calledWith('file-uploaded'))
      .toBeTruthy()
      done()
    })

    // Act
    submitSuccessfulUpload()
  })


 it(`after failed upload: do not hide modal`, (done) => {
    createVue()
    EventBus.listen('modal.shown.bs.modal', () => {
      moxios.wait(() => {
        setTimeout(()=> {
          notExpectEvent('modal.hide.bs.modal')
          done()
        }, 10)
      })
    })

    vm.modal.modal('show')

    submitUpload({
      status: 400
    })
  })
})

let submitSuccessfulUpload = () => {
  submitUpload()
}

let submitUpload = (requestStub = {}, is_uploaded = true) => {
  var requestStub = _.merge({
      status: 200,
      response: { path:'path/to/upload'}
    }, requestStub)

  moxios.stubRequest(vm.update_target , requestStub)
  
  vm.is_uploaded = is_uploaded

  vm.$el.querySelector('.dropzone-upload--button__save').click()
}