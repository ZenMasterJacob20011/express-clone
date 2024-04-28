import pathToRegexp from 'path-to-regexp'

export default function Layer(path, options, fn) {
    if (!(this instanceof Layer)) {
        return new Layer(path, options, fn)
    }
    this.options = options || {}
    this.path = path
    this.handle = fn
    this.params = undefined
    this.pathToRegexp = pathToRegexp(path, this.keys = [], options)
}


Layer.prototype.match = function match(path) {
    const pathMatch = this.pathToRegexp.exec(path)
    if (pathMatch) {
        const keys = this.keys
        this.params = getPathParams(path, this.pathToRegexp, keys)
        return true
    }
    return false
}


Layer.prototype.handle_request = function handle_request(req, res, next) {
    let fn = this.handle
    if (fn.length > 3) {
        return next()
    }
    try {
        fn(req, res, next);
    } catch (err) {
        next(err)
    }
}

Layer.prototype.handle_error = function handle_error(error, req, res, next) {
    let fn = this.handle
    if (fn.length > 4) {
        return next(error)
    }
    try {
        fn(error, req, res, next)
    } catch (err) {
        next(err)
    }
}


function getPathParams(path, regexp, keys) {
    let params = {}
    const pathParams = regexp.exec(path)
    if (pathParams == null) return params
    for (let i = 0; i < pathParams.length - 1; i++) {
        const key = keys[i]
        const name = key.name
        params[name] = pathParams[i + 1]
    }
    return params;
}
