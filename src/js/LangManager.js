let format = require('util').format
let lang = require('./settings/lang.js')

class Lang {
    get(key, ...args) {
        if(window.Laravel.lang != null && window.Laravel.lang[key] != null)
            return format(window.Laravel.lang[key] , ...args)

        return format(lang[key] , ...args)
    }
}

module.exports = (new Lang()).get
