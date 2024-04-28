import setPrototypeOf from "setprototypeof";
import Layer from "./layer.js";
import {flatten} from "array-flatten";
import methods from "methods";
import Route from "./route.js";

const slice = Array.prototype.slice

let proto = {}
export default function () {
    function router(req, res, next) {
        router.handle(req, res, next)
    }

    setPrototypeOf(router, proto)

    router.stack = []

    return router;
}

/**
 * Creates a new route and layer and then sets the layers route property to route and pushes the layer onto the stack
 * @param path {String}
 * @return {route} route
 */
proto.route = function route(path) {
    const route = new Route(path)
    const layer = Layer(path, {end: true}, route.dispatch.bind(route))
    layer.route = route
    this.stack.push(layer)
    return route
}

function restore(fn, req) {
    let baseUrl = req.url

    return function () {
        req.originalUrl = baseUrl
        return fn.apply(this, arguments)
    }
}

/**
 * This function should take the (req,res) and check if the req.
 */
proto.handle = function handle(req, res, out) {
    let idx = 0
    let stack = this.stack
    let method = req.method.toLowerCase();
    let url = req.url
    req.params = req.params || {}
    req.originalUrl = req.url
    let done = restore(out, req)
    next()

    function next(err) {
        let layerError = err === 'route' ? null : err
        if (layerError === 'router') {
            return done(null)
        }
        let match
        let layer
        let route
        while (match !== true && idx < stack.length) {
            layer = stack[idx++]
            match = layer.match(url, method)
            route = layer.route

            if (match !== true) {
                continue
            }
            if (!route) {
                continue
            }

            if (!route._handle_method(method)) {
                match = false
            }
        }

        if (!match) {
            return done(err);
        }
        Object.assign(req.params, layer.params)
        if (layer.options.end) {
            layer.handle_request(req, res, next)
        } else {
            trim_prefix(layer, layerError)
        }
    }

    /**
     * this function removes the prefix of the url and then sets the req.url to the url with the removed prefix
     * @param layerError
     * @param layer
     */
    function trim_prefix(layer, layerError) {
        const layerPathLength = layer.path.length
        const removedPrefixUrl = url.substring(layerPathLength)
        req.url = removedPrefixUrl

        if (layerError) {
            layer.handle_error(layerError, req, res, next)
        } else {
            layer.handle_request(req, res, next);
        }
    }
}

methods.forEach(function (method) {
    proto[method] = function (path) {
        const callbacks = flatten(slice.call(arguments, 1))
        const route = this.route(path)
        route[method].apply(route, callbacks)
    }
})


proto.use = function use(fn) {
    let offset = 0
    let path = "/"
    if (typeof fn !== 'function') {
        offset = 1
        path = fn
        fn = arguments[1]
    }
    const layer = new Layer(path, {end: false}, fn)
    this.stack.push(layer)
}
