import parameterMeta from '../src/js/components/parameter-meta'

describe('parameter-meta Component', () => {
  var fakeModal;

  var parameter = TestData.modified_parameters[0]

  beforeEach(()=> {
    commonBeforeEach(parameterMeta)

    fakeModal = {
        data_title: '',
        data_html: '',
        showModal() { }
    }
})

  afterEach(commonAfterEach)

  it('shows the humanized updated date for the parameter', () => {
    createVue({
        parameter: TestData.modified_parameters[0]
    })

    expect(vm.$el.textContent)
    .toContain(TestData.modified_parameters[0].humanizedUpdatedAt)
  })

  it('logs: `countLogs` method represents the logs length', () => {
    createVue({
        parameter: TestData.modified_parameters[0]
    })

    expect(vm.countLogs)
    .toBe(TestData.modified_parameters[0].meta.logs.length)
  })

  it('change-category button fires `change-paramCategory` event', (done) => {
    createVue({
        parameter: TestData.modified_parameters[0]
    })

    vm.$el.querySelector('.parameter-meta--changeCategory-button').click()
    then(() => {
        expectEvent('change-paramCategory')
        done()
    })
  })

  it('shows more than one log', (done) => {
    Helper.modal = fakeModal
    var parameter = TestData.modified_parameters.filter((parameter) =>  parameter.type == 'text')[0]

    createVue({
        parameter
    })

    .then(() => {
        expect(parameter.meta.logs.length)
        .toBeGreaterThanOrEqual(2)

        parameter.meta.logs.forEach((log) => {
          expect(vm.$el.textContent)
          .toContain(log.old)
        })
        done()
    })
  })

  it('show logs from DOM button', () => {
    createVue({
        parameter
    })

    spy('showLogs')

    vm.$el.querySelector('.parameter-meta--showLogs-button').click()
    
    expect(vm.showLogs.calledOnce)
    .toBe(true)
  })

  it('uses modal for logs', () => {
    createVue({parameter})

    spy('showModal', fakeModal)

    Helper.modal = fakeModal

    vm.$el.querySelector('.parameter-meta--showLogs-button').click()

    expect(vm.getModal().data_html)
    .toContain(parameter.meta.logs[0].old)

    expect(vm.getModal().showModal.calledOnce)
    .toBe(true)
  })
})

