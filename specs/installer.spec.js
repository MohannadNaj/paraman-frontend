import installer from '../src/js/components/installer'
import _package from '../package.json'

describe('installer Component', () => {
  beforeEach(()=> {
    commonBeforeEach(installer)
    window.Laravel.installationData = {
            databasePath: 'databasePath',
            migrationPaths: 'migrationPaths'
        }
  })

  afterEach(commonAfterEach)


  let clickAction = () => {
    window.vm.$el.querySelector('.installer-header--step-action__btn').click()
  }

  let stubs = {
    success: {
       createDBRequest(response = {status: true, path: 'path/to/database/file'}) {
        moxios.stubRequest(`${window.Laravel.base_url}parameters/createDB`, {
          status: 200,
          response: response
        })
      },
       migrate(response = {output:'migrated'}) {
        moxios.stubRequest(`${window.Laravel.base_url}parameters/migrate`, {
          status: 200,
          response: response
        })
      },
    },
    failure: {
      createDatabase(response = {}) {
        moxios.stubRequest(`${window.Laravel.base_url}parameters/createDB`, {
          status: 422,
          response: response
        })
      },
       migrate(response = {}) {
        moxios.stubRequest(`${window.Laravel.base_url}parameters/migrate`, {
          status: 422,
          response: response
        })
      },
    }
  }

  it('has the public properties used in the test suite', () => {
    createVue()
    expect(typeof vm.getStepByAction)
    .toBe('function')
    expect(typeof vm._computedWatchers.getActiveStep)
    .toBe('object')
  })

  it('shows package version', () => {
    createVue()

    expect(vm.$el.textContent)
    .toContain(_package.version)
  })

  it(`has 'createDatabase' and 'migrate' steps`, () => {
    createVue()

    let actionExist = (action) => { 
        expect(vm.steps.map(x => x.action))
        .toContain(action)
    }

    ;['createDatabase','migrate'].forEach(actionExist)
  })

  it('shows only the active step', (done) => {
    window.Laravel.needInstallation = false
    window.Laravel.needMigration = true

    createVue()

    expect(vm.$el.textContent)
    .not.toContain(vm.getStepByAction('createDatabase').text)

    then(() => {
        expect(vm.$el.textContent)
        .toContain(vm.getStepByAction('migrate').text)
        done()
    })
  })

  it(`set the correct step state for 'createDatabase'`, (done) => {
    window.Laravel.needInstallation = false

    createVue()

    expect(vm.getStepByAction('createDatabase').isDone)
    .toBeTruthy()

    then(() => {
      expect(vm.$el.querySelector('.installer-header--steps__done'))
      .toBeDefined()
      done()
    })
  })

  it(`set the correct step state for 'migrate'`, () => {
    window.Laravel.needMigration = false

    createVue()

    expect(vm.getStepByAction('migrate').isDone)
    .toBeTruthy()
  })

  it(`if 'createDatabase' and 'migrate' is not done, set 'createDatabase' as the active step`, (done) => {
    window.Laravel.needInstallation = true
    window.Laravel.needMigration = true

    createVue()
    .then(() => {
      expect(vm.getActiveStep.action)
      .toEqual('createDatabase')
      done()
    })
  })

  it(`if 'createDatabase' is done and 'migrate' is not, set 'migrate' as the active step`, (done) => {
    window.Laravel.needInstallation = false
    window.Laravel.needMigration = true

    createVue()
    .then(() => {
      expect(vm.getActiveStep.action)
      .toEqual('migrate')
      done()
    })
  })

  it(`fire 'activated-installerStep' event after step activation`, done => {
    window.Laravel.needInstallation = false
    window.Laravel.needMigration = true

    EventBus.listen('activated-installerStep', done)

    createVue()
  })

  it(`pass the correct data on 'activated-installerStep' event`, done => {
    window.Laravel.needInstallation = false
    window.Laravel.needMigration = true

    EventBus.listen('activated-installerStep', (data) => {
      expect(data.new.action)
      .toBe('migrate')
      done()
    })

    createVue()
  })

  it(`notify user after successful 'createDatabase' request`, (done) => {
    window.Laravel.needInstallation = true
    window.Laravel.needMigration = true

    createVue()

    then(() => {
      stubs.success.createDBRequest()
      clickAction()
    })
    
    next(() => {
      expect(vm.notificationStore.state[0].message)
      .toContain('created')
      done()
    },10)
  })

  it(`set the correct 'isDone' state after successful 'createDatabase' request`, (done) => {
    window.Laravel.needInstallation = true
    window.Laravel.needMigration = true

    createVue()

    then(() => {
      expect(vm.getStepByAction('createDatabase').isDone)
      .toBeFalsy()

      stubs.success.createDBRequest()
      clickAction()
    })
    
    next(() => {
      expect(vm.getStepByAction('createDatabase').isDone)
      .toBeTruthy()
      done()
    },10)
  })

  it(`set the correct 'isDone' state after successful 'createDatabase' request`, (done) => {
    window.Laravel.needInstallation = true
    window.Laravel.needMigration = true

    createVue()

    then(() => {
      expect(vm.getStepByAction('createDatabase').isDone)
      .toBeFalsy()

      stubs.success.createDBRequest()
      clickAction()
    })
    
    next(() => {
      expect(vm.getStepByAction('createDatabase').isDone)
      .toBeTruthy()
      done()
    },10)
  })
})
