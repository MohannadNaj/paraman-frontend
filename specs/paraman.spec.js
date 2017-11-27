import paraman from '../src/js/components/paraman'

describe('paraman Component', () => {
  beforeEach(()=> {
    commonBeforeEach(paraman)
    window.Laravel.installationData = {
            databasePath: 'databasePath',
            migrationPaths: 'migrationPaths'
        }
  })

  afterEach(commonAfterEach)

  let paramanVue = (parametersList = []) => {createVue({parametersList})}

  it(`has a 'parametersList' property`, () => {

    expect(paraman.props.parametersList)
    .toBeDefined()
  })

  it(`fire 'need-installation' event if it's need installation`, (done) => {
    EventBus.listen('need-installation', done)

    window.Laravel.needInstallation = true

    paramanVue([])
  })

  it(`fire 'need-installation' event if it's need migration`, (done) => {
    EventBus.listen('need-installation', done)

    window.Laravel.needInstallation = false
    window.Laravel.needMigration = true

    paramanVue([])
  })

  it(`event 'need-installation' isn't fired if installation isn't required`, (done) => {
    window.Laravel.needInstallation = false
    window.Laravel.needMigration = false

    paramanVue([])

    next(()=>{
      notExpectEvent('need-installation')
      done()
    }, 10)
  })

  it(`set a global modal helper`, (done) => {
    paramanVue([])
    next(()=> {
      expect(Helper.modal)
      .toBeDefined()
      done()
    })
  })

  it(`set a global dropzoneModal helper`, (done) => {
    paramanVue([])
    next(()=> {
      expect(Helper.dropzoneModal)
      .toBeDefined()
      done()
    })
  })
})
