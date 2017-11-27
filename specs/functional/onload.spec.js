import paraman from '../../src/js/components/paraman'
import _package from '../../package.json'

describe('functional: onload', () => {
  beforeEach(()=> {
    commonBeforeEach(paraman)
    window.Laravel.installationData = {
            databasePath: 'databasePath',
            migrationPaths: 'migrationPaths'
        }
  })

  afterEach(() => {
    commonAfterEach()
    window.Laravel.needInstallation = false
    window.Laravel.needMigration = false
  })

  let paramanVue = (parametersList = []) => {createVue({parametersList})}

  it('shows package version', () => {
    paramanVue([])

    expect(textContent())
    .toContain(_package.version)
  })

  it(`shows package version on installer if needs installation`, (done) => {
    window.Laravel.needInstallation = true

    paramanVue([])

    then(() => {
      expect(textContent())
      .toContain(_package.version)
      done()
    })
  })

  it(`shows 'no parameters' message if it's parameters list is empty`, () => {
    paramanVue([])

    expect(textContent().toLowerCase())
    .toContain('no parameters')
  })

  it(`shows 'no categories' message if it's parameters list is empty`, () => {
    paramanVue([])

    expect(textContent().toLowerCase())
    .toContain('no categories')
  })

  it(`shows installer if needs installation`, (done) => {
    window.Laravel.needInstallation = true

    paramanVue([])

    then(() => {
      expect(textContent().toLowerCase())
      .toContain('installer')
      done()
    })
  })

  it(`shows installer if needs installation even if parametersList is present`, (done) => {
    window.Laravel.needInstallation = true

    paramanVue(TestData.parameters)

    then(() => {
      expect(textContent().toLowerCase())
      .toContain('installer')
      done()
    })
  })

  it(`shows parameter data if parametersList is not empty`, (done) => {
    paramanVue([TestData.parameters[0]])

    next(() => {
      ['label', 'humanizedUpdatedAt', 'type']
      .forEach((prop) => {
         expect(textContent())
        .toContain(TestData.parameters[0][prop])
      })
      done()
    }, 10)
  })
})

let textContent = () => {return window.vm.$el.textContent}
