import paraman from '../src/js/components/paraman'

describe('paraman Component', () => {
  beforeEach(()=> {
    commonBeforeEach(paraman)
    window.Paraman.installationData = {
            databasePath: 'databasePath',
            migrationPaths: 'migrationPaths'
        }
    window.Paraman.logo = null
  })

  afterEach(commonAfterEach)

  let paramanVue = (parametersList = []) => {createVue({parametersList})}

  it(`has a 'parametersList' property`, () => {

    expect(paraman.props.parametersList)
    .toBeDefined()
  })

  it(`fire 'need-installation' event if it's need installation`, (done) => {
    EventBus.listen('need-installation', done)

    window.Paraman.needInstallation = true

    paramanVue([])
  })

  it(`fire 'need-installation' event if it's need migration`, (done) => {
    EventBus.listen('need-installation', done)

    window.Paraman.needInstallation = false
    window.Paraman.needMigration = true

    paramanVue([])
  })

  it(`event 'need-installation' isn't fired if installation isn't required`, (done) => {
    window.Paraman.needInstallation = false
    window.Paraman.needMigration = false

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

  it(`fire 'custom-logo' event if it uses custom logo`, (done) => {
    EventBus.listen('custom-logo', done)

    window.Paraman.logo = {}

    paramanVue([])
  })

  it(`event 'custom-logo' isn't fired if logo isn't set`, (done) => {
    window.Paraman.logo = null

    paramanVue([])

    next(()=>{
      notExpectEvent('custom-logo')
      done()
    }, 10)
  })

})
