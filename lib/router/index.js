import setPrototypeOf from "setprototypeof";
import Layer from "./layer.js";
import {flatten} from "array-flatten";
import methods from "methods";

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
 * call this function on router to push a layer onto the stack with the path
 * @param path {string}
 * @param method {string}
 */
proto.route = function route(path, method) {
    path = !path ? '*' : path
    const middlewares = flatten(slice.call(arguments, 2));
    for (const middleware of middlewares) {
        const layer = Layer(path, method, {end: true}, middleware)
        this.stack.push(layer)
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
    next()

    function next(err) {
        let match
        let layer
        while (match !== true && idx < stack.length) {
            layer = stack[idx++]
            match = layer.match(url, method)
        }
        if (!match) {
            return out();
        }
        Object.assign(req.params, layer.params)
        if (layer.options.end) {
            layer.handle_request(req, res, next)
        } else {
            trim_prefix(layer)
        }
    }

    /**
     * this function removes the prefix of the url and then sets the req.url to the url with the removed prefix
     * @param layer
     */
    function trim_prefix(layer) {
        const slashIndex = url.indexOf("/", 1)
        const removedPrefixUrl = url.substring(slashIndex)
        req.url = removedPrefixUrl
        layer.handle_request(req, res, next);
    }
}

methods.forEach(function (method) {
    proto[method] = function (path) {
        const callbacks = flatten(slice.call(arguments, 1))
        this.route(path, method, callbacks)
    }
})


proto.use = function use(fn) {
    let offset = 0
    let path = "*"
    if (typeof fn !== 'function') {
        offset = 1
        path = fn
        fn = arguments[1]
    }
    const layer = new Layer(path, undefined, {end: false}, fn)
    this.stack.push(layer)
}
