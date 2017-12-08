let format = require('util').format
let routes = require('./settings/routes.js')

class Route {
    get(key, ...args) {
        args = [window.Laravel.base_url, ...args]

        return format(routes[key] , ...args)
    }
}

module.exports = (new Route()).get
