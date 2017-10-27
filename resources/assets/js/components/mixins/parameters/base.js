import controls from './categories/controls.js'
import paramCategories from './categories/paramCategories.js'
import viewModels from './categories/viewModels.js'
import parameters from './parameters.js'

export default {
  mixins: [controls, paramCategories, viewModels, parameters]
}
