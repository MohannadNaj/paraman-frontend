let format = require('util').format
let lang = require('./settings/lang.js')

class Lang {
  get(key, ...args) {
    if (window.Paraman.lang != null && window.Paraman.lang[key] != null)
      return format(window.Paraman.lang[key], ...args)

    return format(lang[key], ...args)
  }
}

module.exports = new Lang().get
