import installer from '../src/js/components/installer'

describe('installer Component', () => {
  beforeEach(()=> {
    commonBeforeEach(installer)
    window.Paraman.installationData = {
            databasePath: 'databasePath',
            migrationPaths: 'migrationPaths'
        }
  })

  afterEach(commonAfterEach)


  let clickAction = () => {
    window.vm.$el.querySelector('.installer-step__button--action').click()
  }

  let dbPath = `path/to/database/file`

  let stubs = {
    success: {
       createDBRequest(response = {status: true, path: dbPath}) {
        moxios.stubRequest(`${window.Paraman.base_url}parameters/createDB`, {
          status: 200,
          response: response
        })
      },
       migrate(response = {output:'migrated'}) {
        moxios.stubRequest(`${window.Paraman.base_url}parameters/migrate`, {
          status: 200,
          response: response
        })
      },
    },
    failure: {
      createDatabase(response = {}) {
        moxios.stubRequest(`${window.Paraman.base_url}parameters/createDB`, {
          status: 422,
          response: response
        })
      },
       migrate(response = {}) {
        moxios.stubRequest(`${window.Paraman.base_url}parameters/migrate`, {
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

  it(`has 'createDatabase' and 'migrate' steps`, () => {
    createVue()

    let actionExist = (action) => { 
        expect(vm.steps.map(x => x.action))
        .toContain(action)
    }

    ;['createDatabase','migrate'].forEach(actionExist)
  })

  it('shows only the active step', (done) => {
    window.Paraman.needInstallation = false
    window.Paraman.needMigration = true

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
    window.Paraman.needInstallation = false

    createVue()

    expect(vm.getStepByAction('createDatabase').isDone)
    .toBeTruthy()

    then(() => {
      expect(vm.$el.querySelector('.installer-step__container--done'))
      .toBeDefined()
      done()
    })
  })

  it(`set the correct step state for 'migrate'`, () => {
    window.Paraman.needMigration = false

    createVue()

    expect(vm.getStepByAction('migrate').isDone)
    .toBeTruthy()
  })

  it(`if 'createDatabase' and 'migrate' is not done, set 'createDatabase' as the active step`, (done) => {
    window.Paraman.needInstallation = true
    window.Paraman.needMigration = true

    createVue()
    .then(() => {
      expect(vm.getActiveStep.action)
      .toEqual('createDatabase')
      done()
    })
  })

  it(`if 'createDatabase' is done and 'migrate' is not, set 'migrate' as the active step`, (done) => {
    window.Paraman.needInstallation = false
    window.Paraman.needMigration = true

    createVue()
    .then(() => {
      expect(vm.getActiveStep.action)
      .toEqual('migrate')
      done()
    })
  })

  it(`fire 'activated-installerStep' event after step activation`, done => {
    window.Paraman.needInstallation = false
    window.Paraman.needMigration = true

    EventBus.listen('activated-installerStep', done)

    createVue()
  })

  it(`pass the correct data on 'activated-installerStep' event`, done => {
    window.Paraman.needInstallation = false
    window.Paraman.needMigration = true

    EventBus.listen('activated-installerStep', (data) => {
      expect(data.new.action)
      .toBe('migrate')
      done()
    })

    createVue()
  })

  it(`notify user after successful 'createDatabase' request`, (done) => {
    window.Paraman.needInstallation = true
    window.Paraman.needMigration = true

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

  it(`show database path after successful 'createDatabase' request`, (done) => {
    window.Paraman.needInstallation = true
    window.Paraman.needMigration = true

    createVue()

    then(() => {
      stubs.success.createDBRequest()
      clickAction()
    })
    
    next(() => {
      expect(vm.$el.textContent)
      .toContain(dbPath)
      done()
    },10)
  })

  it(`set the correct 'isDone' state after successful 'createDatabase' request`, (done) => {
    window.Paraman.needInstallation = true
    window.Paraman.needMigration = true

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
    window.Paraman.needInstallation = true
    window.Paraman.needMigration = true

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
