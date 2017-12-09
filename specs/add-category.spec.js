import addCategory from '../src/js/components/add-category'

describe('add-category Component', () => {

  beforeEach(()=> commonBeforeEach(addCategory))

  afterEach(commonAfterEach)

  it(`validate category name before submit`, done => {
    // arrange
    createVue()

    // act
    vm.newCategoryName = ''
    let submit = vm.submit()

    // assert
    expect(submit).toBe(null)

    then(() => {
      expect(
        vm.$el.querySelector('.add-category__button--submit').disabled
      ).toBe(true)

      notExpectEvent('start-addCategory')

      expect(vm.validCategoryName).toBe(false)
      done()
    })
  })

  it(`submit successful request: fire created-category event`, done => {
    // arrange
    createVue()
    vm.newCategoryName = 'new category'
    moxios.stubRequest(window.Paraman.base_url + 'parameters/addCategory', {
      status: 200,
      response: { parameter: { id: 1 } }
    })

    // act
    vm.submit()

    // assert
    moxios.wait(() => {
      then(() => {
        expectEvent('end-addCategory')
        then(done)
      })
    })
  })

  it(`submit request (failed?): include newCategoryName in the request`, done => {
    // arrange
    createVue()
    vm.newCategoryName = 'new category'

    // act
    submitFailedRequest({}, 'parameters/addCategory')
      // assert
      .then(() => {
        let request = moxios.requests.mostRecent()

        expect(JSON.parse(request.config.data)).toEqual({
          value: 'new category'
        })
        done()
      })
  })

  it(`submit request (failed?): fire start-addCategory event`, done => {
    // arrange
    createVue()
    vm.newCategoryName = 'new category'
    // act
    submitFailedRequest({}, 'parameters/addCategory')
    // assert
    .then(() => {
        expectEvent('start-addCategory')
        then(done)
    })
  })

  it(`submit failed request: notify the user about the error`, done => {
    // arrange
    createVue()
    vm.newCategoryName = 'new category'
    // act
    submitFailedRequest({}, 'parameters/addCategory')
      // assert
      .then(() => {
        expect(window.vm.notificationStore.state.length).toBe(1)
        done()
      })
  })

  it(`submit failed request: fire end-addCategory event`, done => {
    // arrange
    createVue()
    vm.newCategoryName = 'new category'

    // assert
    EventBus.listen('end-addCategory', () => {
      expectEvent('end-addCategory')
      then(done)
    })

    // act
    submitFailedRequest({}, 'parameters/addCategory')
  })

  it(`submit failed request: created-category event is not fired`, done => {
    // arrange
    createVue()
    vm.newCategoryName = 'new category'
    // act
    submitFailedRequest({}, 'parameters/addCategory')
      // assert
    .then(() => {
        setTimeout(() => {
          notExpectEvent('created-category')
          then(done)
        }, 10)
    })
  })
})
