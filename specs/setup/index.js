TestData = require('./testData.json')
moxios = require('moxios')
sinon = require('sinon')
Promise = require('promise-polyfill')

require('./testUtils.js')
require('./fakeDataHelper.js')

window.Laravel = TestData.clientData

require('../../src/js/core.js')
require('../../src/js/bootstrap.js')
Vue.config.productionTip = false
