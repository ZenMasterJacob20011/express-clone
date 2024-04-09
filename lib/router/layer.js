import pathToRegexp from 'path-to-regexp'

export default function Layer(path, method, options, fn) {
    if (!(this instanceof Layer)) {
        return new Layer(path, method, options, fn)
    }
    this.options = options || {}
    this.method = method
    this.path = path
    this.handle = fn
    this.params = undefined
    this.pathToRegexp = pathToRegexp(path, this.keys = [], options)
}


Layer.prototype.match = function match(path, method) {
    const layerPath = this.path
    const pathMatch = Boolean(this.pathToRegexp.exec(path))
    const layerMethod = this.method
    const keys = this.keys
    if (!layerPath && !layerMethod) {
        return true
    } else if (!layerPath) {
        return layerMethod === method
    } else if (!layerMethod) {
        this.params = getPathParams(path, this.pathToRegexp, keys)
        return pathMatch
    }
    this.params = getPathParams(path, this.pathToRegexp, keys);
    return pathMatch && method === this.method;
}


Layer.prototype.handle_request = function handle_request(req, res, next) {
    let fn = this.handle
    try {
        fn(req, res, next);
    } catch (err) {
        next(err)
    }
}


Layer.prototype.handles_method = function handles_method(method) {
    return this.method === method
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
