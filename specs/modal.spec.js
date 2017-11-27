import Modal from '../src/js/components/modal'

describe('Modal Component', () => {

  beforeEach(()=> commonBeforeEach(Modal))

  afterEach(commonAfterEach)

  it('sets the correct default data', () => {
    expect(typeof Modal.data).toBe('function')
    let defaultData = Modal.data()
    expect(defaultData.data_save).toBe('')
  })

  it('correctly sets the message when mounted', done => {
    createVue()

    then(() => {
      vm.data_body = 'heeey!'
      expect(vm.data_body).toBe('heeey!')
      done()
    })
  })

  it('renders the correct message', done => {
    createVue({
      title: 'Title!',
      save: 'Save Message!',
      html: '<p class="save-paragraph">Lorem!</p>'
    })

    then(() => {
      expect(vm.$el.querySelector('.modal-title').textContent).toBe('Title!')

      expect(vm.$el.querySelector('.btn.btn-primary').textContent).toBe(
        'Save Message!'
      )

      expect(vm.$el.querySelector('.save-paragraph').textContent).toBe('Lorem!')
      done()
    })
  })

  it('open modal', done => {
    createVue()
    EventBus.listen('modal.show.bs.modal', done)

    then(vm.showModal).then(() => {
      expectEvent('modal.show.bs.modal')
      done()
    })
  })

  it('hide footer if requested', done => {
    createVue()
    vm.data_showFooter = false
    vm.data_close = 'Close Message'

    then(vm.showModal).then(() => {
      expect(vm.$el.textContent).not.toContain('Close Message')
      done()
    })
  })

  it('send event on "submit" button click', done => {
    createVue()
      .then(vm.showModal)
      .then(() => {
        $(vm.$el).find('#modal-submit')[0].click()
      })
      .then(() => {
        expectEvent('modal-submit')
        done()
      })
  })

  it('show remove-parameter component', done => {
    showComponentInModal('remove-parameter', done)
  })

  it('show change-paramCategory component', done => {
    showComponentInModal('change-paramCategory', done)
  })

  it('hide component after close', done => {
    EventBus.listen('modal.shown.bs.modal', () => {
      vm.hideModal()
    })

    showComponentInModal('remove-parameter', () => {
      spy('hideComponent')

      EventBus.listen('modal.hidden.bs.modal', () => {
        
          expect(vm.data_showComponent).toBeFalsy()
          expect(vm.hideComponent.callCount).toBe(1)
          done()

      })    
    })
  })
})

var showComponentInModal = (componentTag, done) => {
  createVue()

  vm.showComponent(componentTag, 'some title')
  then(() => {
    vm.showModal()
  }).then(
    () => {
      expect(vm.$el.textContent).toContain('some title')

      expect(vm.$el.textContent).toContain(vm.getComponent().$el.textContent)

      expectEvent('modal.show.bs.modal')
      done()
    },
    vm.getComponent()
  )
}
