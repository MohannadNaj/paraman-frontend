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
    }, 20)
  })

  it(`open the first category and shows it's parameters data`, (done) => {
    let activeCategory = TestData.categories[0] // zero index = first category
    let activeCategoryParameters = TestData.categorized_parameters.filter(x => x.category_id == activeCategory.id )

    paramanVue([...TestData.categories , ...TestData.categorized_parameters])

    next(() => {
      // expected event
      expectEvent('opening-category')

      // first category's name
      expect(vm.$el.querySelector('.parameters-list__header').textContent)
      .toContain(activeCategory.value)

      // first category's parameters length
      expect(vm.$el.querySelector('.parameters-list__header').textContent)
      .toContain(activeCategoryParameters.length)

      // first category's parameters data
      ;['label', 'humanizedUpdatedAt', 'type']
      .forEach((prop) => {
        // first parameter in the active category is present
        expect(textContent())
        .toContain(activeCategoryParameters[0][prop])
      })

      done()
    }, 20)
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
      expect(vm.$el.querySelector('.parameters-list__header').textContent)
      .toContain(activeCategory.value)

      // location-hash category's parameters length
      expect(vm.$el.querySelector('.parameters-list__header').textContent)
      .toContain(activeCategoryParameters.length)

      // location-hash category's parameters data
      ;['label', 'humanizedUpdatedAt', 'type']
      .forEach((prop) => {
        // first parameter in the active category is present
        expect(textContent())
        .toContain(activeCategoryParameters[0][prop])
      })

      done()
    }, 20)
  })

  it(`if the location hash is 'categories' ignore it`, (done) => {
    window.location.hash = `#categories`
 
    let activeCategory = TestData.categories[1]

    paramanVue([...TestData.categories , ...TestData.categorized_parameters])

    next(() => {
      // 
      expect(vm.$el.querySelector('.parameters-list__header').textContent.toLowerCase())
      .not.toContain('categories')

      done()
    }, 20)
  })

  it(`default to "add parameter" if a category exist`, (done) => {
    paramanVue([TestData.categories[0]])

    next(() => {
      expect(vm.$el.querySelector('.parameters-list').textContent.toLowerCase())
      .toContain('no parameters added')

      done()
    }, 20)
  })

  it(`show "add category" in the sidebar if there is no categories`, (done) => {
    paramanVue([])

    next(() => {
      // 
      expect(vm.$el.querySelector('.sidebar').textContent.toLowerCase())
      .toContain('no categories found')

      done()
    }, 20)
  })

  it(`uses the lang file`, (done) => {
    paramanVue([])

    next(() => {
      expect(typeof vm.lang)
      .toBe('function')

      expect(vm.lang('add_category_label').toLowerCase())
      .toContain('category')

      expect(vm.$el.querySelector('.sidebar').textContent)
      .toContain(vm.lang('add_category_label'))

      done()
    }, 20)
  })

  it(`uses the defined custom lang`, (done) => {
    window.Laravel.lang = {add_category_label: 'foo bar'}
    paramanVue([])

    next(() => {

      expect(vm.$el.querySelector('.sidebar').textContent)
      .toContain('foo bar')

      window.Laravel.lang = null
      done()
    }, 20)
  })

  it(`set the location hash to the default loaded category (first one)`, (done) => {

    let activeCategory = TestData.categories[0]

    paramanVue([...TestData.categories , ...TestData.categorized_parameters])

    next(() => {

      expect(window.location.hash)
      .toBe(`#${activeCategory.id}`)

      done()
    }, 20)
  })

  it(`can configure the logo: image and text`, (done) => {
    window.Laravel.logo = {
      text: 'foo bar',
      image: '/path/to/img'
    }
    paramanVue([])

    next(() => {

      expect(vm.$el.querySelector('.parameters-sidebar__logo').textContent)
      .toContain(`foo bar`)

      expect(vm.$el.querySelector('.parameters-navbar').textContent)
      .toContain(`foo bar`)

      expect(vm.$el.querySelector('.parameters-sidebar__logo').innerHTML)
      .toContain(`/path/to/img`)

      expectEvent('custom-logo')

      window.Laravel.logo = null
      done()
    }, 20)
  })

  it(`can configure the logo: text only`, (done) => {
    window.Laravel.logo = {
      text: 'foo bar'
    }
    paramanVue([])

    next(() => {

      expect(vm.$el.querySelector('.parameters-sidebar__logo').textContent)
      .toContain(`foo bar`)

      expect(vm.$el.querySelector('.parameters-navbar').textContent)
      .toContain(`foo bar`)

      expect(vm.$el.querySelector('.parameters-sidebar__logo').innerHTML.toLowerCase())
      .toContain('paraman logo')

      expectEvent('custom-logo')

      window.Laravel.logo = null
      done()
    }, 20)
  })

  it(`integrate custom components`, (done) => {
    Vue.component('editor-custom', {template:'<i>foo bar</i>'})

    let customizedParam = Object.assign(TestData.parameters[0], {type:'custom'})

    paramanVue([customizedParam])

    next(() => {

      expect(vm.$el.querySelector('.parameter').textContent)
      .toContain(`foo bar`)

      done()
    }, 20)
  })

  it(`integrate custom components with custom settings: hide header and keep footer`, (done) => {
    Vue.component('editor-custom', {template:'<i>foo bar</i>'})
    window.Laravel.components = {'editor-custom': {header: false, footer: true}}
    let customizedParam = Object.assign(TestData.parameters[0], {type:'custom'})

    paramanVue([customizedParam])

    next(() => {

      expect(vm.$el.querySelector('.parameter__title-container'))
      .toBeFalsy()

      expect(vm.$el.querySelector('.parameter-meta__container'))
      .toBeTruthy()

      window.Laravel.components = {}
      done()
    }, 20)
  })

  it(`integrate custom components with custom settings: hide footer and keep header`, (done) => {
    Vue.component('editor-custom', {template:'<i>foo bar</i>'})
    window.Laravel.components = {'editor-custom': {header: true, footer: false}}
    let customizedParam = Object.assign(TestData.parameters[0], {type:'custom'})

    paramanVue([customizedParam])

    next(() => {

      expect(vm.$el.querySelector('.parameter-meta__container'))
      .toBeFalsy()

      expect(vm.$el.querySelector('.parameter__title-container'))
      .toBeTruthy()

      window.Laravel.components = {}
      done()
    }, 20)
  })

  it(`integrate custom components with custom settings: custom css container`, (done) => {
    Vue.component('editor-custom', {template:'<i>foo bar</i>'})
    window.Laravel.components = {'editor-custom': {cssContainer: 'foo-bar'}}
    let customizedParam = Object.assign(TestData.parameters[0], {type:'custom'})

    paramanVue([customizedParam])

    next(() => {

      expect(vm.$el.querySelector('.parameter').getAttribute('class'))
      .toContain('foo-bar')

      window.Laravel.components = {}
      done()
    }, 20)
  })
})

let textContent = () => {return window.vm.$el.textContent}
