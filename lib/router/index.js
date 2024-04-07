import setPrototypeOf from "setprototypeof";
import Layer from "./layer.js";
import {flatten} from "array-flatten";

const slice = Array.prototype.slice

let proto = {}
export default function () {
    function router(req, res, next) {
        this.handle(res, res, next)
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
    const middlewares = flatten(slice.call(arguments, 2));
    for (const middleware of middlewares) {
        const layer = Layer(path, method, {}, middleware)
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
        layer.handle_request(req, res, next)
    }
}
