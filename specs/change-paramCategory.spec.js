import changeParamCategory from '../resources/assets/js/components/change-paramCategory'

describe('change-paramCategory Component', () => {

  beforeEach(()=> commonBeforeEach(changeParamCategory))

  afterEach(commonAfterEach)

  it(`check for empty string if parameter's category is null`, done => {
    // arrange
    createVue()

    vm.parameter = _.clone(TestData.categorized_parameters[0])
    vm.parameter.category_id = null

    var category = { target: '' }

    // act
    var paramBelongsToCategory = vm.paramBelongsToCategory(category)

    // assert
    then(() => {
      expect(paramBelongsToCategory).toBe(true)
      done()
    })
  })

  it('can update categories', done => {
    createVue()
    vm.parameter = TestData.categorized_parameters[0]

    expect(typeof vm.updateCategories).toBe('function')

    vm.updateCategories(appCategory({}, 4))

    then(() => {
      expect(vm.categories.length).toBe(4)
      done()
    })
  })

  it('mount the given categories', done => {
    createVue()

    vm.parameter = TestData.categorized_parameters[0]

    setUpCategories()

    then(() => {
      TestData.categories.forEach(_category => {
        expect(vm.$el.textContent).toContain(_category.value)
        done()
      })
    })
  })

  it('listen to the correct events', done => {
    var listenEventsLength = EventBus.getListenHistory().length
    createVue()
    var expectedEvents = [
      'update-categories',
      'changed-paramCategory',
      'start-addCategory',
      'end-addCategory'
    ]

    expect(EventBus.getListenHistory().length).toBeGreaterThanOrEqual(
      listenEventsLength + expectedEvents.length
    )

    then(() => {
      expectedEvents.forEach(event => {
        expectListenEvent(event)
      })
      done()
    })
  })

  it('check if parameter belongs to category', done => {
    // arrange
    createVue()

    setUpCategories()

    // act
    vm.parameter = TestData.categorized_parameters[0]

    var selectedParameterCategory = getParameterCategory()

    // assert

    then(() => {
      vm.categories.forEach(_category => {
        expect(vm.paramBelongsToCategory(_category)).toBe(
          selectedParameterCategory.target == _category.target
        )
      })

      //   validate test data
      expect(typeof selectedParameterCategory).toBe('object')
      expect(vm.categories.length).toBeGreaterThan(2)
      done()
    })
  })

  it(`do nothing if parameter's category is chosen`, done => {
    // arrange
    createVue()

    setUpCategories()

    vm.parameter = TestData.categorized_parameters[0]

    var selectedParameterCategory = getParameterCategory()

    // act
    var choseCategory = vm.choseCategory(selectedParameterCategory)

    // assert
    then(() => {
      expect(choseCategory).toBeNull()
      expect(EventBus.getFireHistory().length).toBe(0)
      done()
    })
  })

  it('alert and stop if category is chosen while busy', done => {
    // arrange
    createVue()

    setUpCategories()

    vm.parameter = TestData.categorized_parameters[0]
    vm.isBusy = true

    // act
    then(() => {
      vm.choseCategory({ target: 'target' })
    })
      // assert
      .then(() => {
        expect(vm.notificationStore.state.length).toBe(1)
        expect(vm.notificationStore.state[0].message).toBe(
          'Wait until the previous request processed..'
        )

        expect(EventBus.getFireHistory().length).toBe(0)
        done()
      })
  })

  it('fire event if a valid-to-chose category is chosen', done => {
    // arrange
    createVue()

    setUpCategories()

    vm.parameter = TestData.categorized_parameters[0]

    var newCategory = _.find(
      vm.categories,
      _category => _category.target != vm.parameter.category_id
    )

    // act
    then(() => {
      vm.choseCategory(newCategory)
    })
      // assert
      .then(() => {
        expectEvent('chose-paramCategory')

        expect(EventBus.getFireHistory().length).toBe(1)
        done()
      })
  })
})

var getParameterCategory = () => {
  return _.find(
    vm.categories,
    _category => _category.target == vm.parameter.category_id
  )
}
