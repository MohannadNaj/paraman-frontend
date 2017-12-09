import paraman from '../../src/js/components/paraman'

describe('parameter: crud', () => {
  beforeEach(()=> {
    commonBeforeEach(paraman)
    window.Paraman.installationData = {
        databasePath: 'databasePath',
        migrationPaths: 'migrationPaths'
    }
  })

  afterEach(() => {
    commonAfterEach()
    window.Paraman.needInstallation = false
    window.Paraman.needMigration = false
    delete window.Paraman.editableLabels
    delete window.Paraman.editParametersOnly
  })

  let paramanVue = (parametersList = []) => {createVue({parametersList})}

  it(`can edit parameter's labels`, (done) => {
    paramanVue([TestData.textfield[0]])

    next(() => {

      vm.$el.querySelector('.parameter__button--edit').click()

      then(() => {
        expect(vm.$el.querySelector('.parameter__parameter-label--editable'))
        .toBeTruthy()

        done()
      })
    }, 30)
  })

  it(`wouldn't edit parameter's labels if it's configured to not be editable`, (done) => {
    window.Paraman.editableLabels = false

    paramanVue([TestData.textfield[0]])

    next(() => {

      vm.$el.querySelector('.parameter__button--edit').click()

      then(() => {
        expect(vm.$el.querySelector('.parameter__parameter-label--editable'))
        .toBeFalsy()

        done()
      })
    }, 30)
  })

  it(`disable editing labels if "edit parameters only" mode is active`, (done) => {
    window.Paraman.editParametersOnly = true

    paramanVue([TestData.textfield[0]])

    next(() => {

      vm.$el.querySelector('.parameter__button--edit').click()

      then(() => {
        expect(vm.$el.querySelector('.parameter__parameter-label--editable'))
        .toBeFalsy()

        done()
      })
    }, 30)
  })

  it(`enable editing labels if configured to enable it, even in "edit parameters only" mode`, (done) => {
    window.Paraman.editParametersOnly = true
    window.Paraman.editableLabels = true

    paramanVue([TestData.textfield[0]])

    next(() => {

      vm.$el.querySelector('.parameter__button--edit').click()

      then(() => {
        expect(vm.$el.querySelector('.parameter__parameter-label--editable'))
        .toBeTruthy()

        done()
      })
    }, 30)
  })
})

let textContent = () => {return window.vm.$el.textContent}
