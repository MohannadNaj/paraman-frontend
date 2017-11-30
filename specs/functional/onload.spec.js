import paraman from '../../src/js/components/paraman'
import _package from '../../package.json'

fdescribe('functional: onload', () => {
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

  it(`shows parameter data and open category -whatever it's- if parametersList is not empty`, (done) => {
    paramanVue([TestData.parameters[0]])

    next(() => {
      ['label', 'humanizedUpdatedAt', 'type']
      .forEach((prop) => {
         expect(textContent())
        .toContain(TestData.parameters[0][prop])
      })
      expectEvent('opening-category')
      done()
    }, 10)
  })

  it(`open the first category and shows it's parameters data`, (done) => {
    let activeCategory = TestData.categories[0] // zero index = first category
    let activeCategoryParameters = TestData.categorized_parameters.filter(x => x.category_id == activeCategory.id )

    paramanVue([...TestData.categories , ...TestData.categorized_parameters])

    next(() => {
      // expected event
      expectEvent('opening-category')

      // first category's name
      expect(vm.$el.querySelector('.parameters-list--header').textContent)
      .toContain(activeCategory.value)

      // first category's parameters length
      expect(vm.$el.querySelector('.parameters-list--header').textContent)
      .toContain(activeCategoryParameters.length)

      // first category's parameters data
      ;['label', 'humanizedUpdatedAt', 'type']
      .forEach((prop) => {
        // first parameter in the active category is present
        expect(textContent())
        .toContain(activeCategoryParameters[0][prop])
      })

      done()
    }, 10)
  })

  it(`open the category in the location hash and shows it's parameters data`, (done) => {
    let testedCategoryindex = parseInt(TestData.categories.length / 2)
    // we can't assert the zero index because it's the default, so we will write
    // an assertion for that
    expect(testedCategoryindex)
    .not.toBe(0)

    let activeCategory = TestData.categories[testedCategoryindex]
    window.location.hash = `#${activeCategory.id}`

    let activeCategoryParameters = TestData.categorized_parameters.filter(x => x.category_id == activeCategory.id )

    paramanVue([...TestData.categories , ...TestData.categorized_parameters])

    next(() => {
      // expected event
      expectEvent('opening-category')

      // location-hash category's name
      expect(vm.$el.querySelector('.parameters-list--header').textContent)
      .toContain(activeCategory.value)

      // location-hash category's parameters length
      expect(vm.$el.querySelector('.parameters-list--header').textContent)
      .toContain(activeCategoryParameters.length)

      // location-hash category's parameters data
      ;['label', 'humanizedUpdatedAt', 'type']
      .forEach((prop) => {
        // first parameter in the active category is present
        expect(textContent())
        .toContain(activeCategoryParameters[0][prop])
      })

      done()
    }, 10)
  })

  it(`if the location hash is 'categories' ignore it`, (done) => {
    window.location.hash = `#categories`
 
    let activeCategory = TestData.categories[1]

    paramanVue([...TestData.categories , ...TestData.categorized_parameters])

    next(() => {
      // 
      expect(vm.$el.querySelector('.parameters-list--header').textContent.toLowerCase())
      .not.toContain('categories')

      done()
    }, 10)
  })

  it(`set the location hash to the default loaded category (first one)`, (done) => {

    let activeCategory = TestData.categories[0]

    paramanVue([...TestData.categories , ...TestData.categorized_parameters])

    next(() => {

      expect(window.location.hash)
      .toBe(`#${activeCategory.id}`)

      done()
    }, 10)
  })
})

let textContent = () => {return window.vm.$el.textContent}
