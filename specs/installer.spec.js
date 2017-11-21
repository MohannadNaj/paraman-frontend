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

  it(`set the correct step state for 'createDatabase'`, () => {
    window.Laravel.needInstallation = false

    createVue()

    expect(vm.getStepByAction('createDatabase').isDone)
    .toBeTruthy()
  })

  it(`set the correct step state for 'migrate'`, () => {
    window.Laravel.needMigration = false

    createVue()

    expect(vm.getStepByAction('migrate').isDone)
    .toBeTruthy()
  })
})

