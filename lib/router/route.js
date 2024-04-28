import methods from "methods";
import {flatten} from "array-flatten";
import Layer from "./layer.js";

export default function Route(path) {
    this.path = path

    this.stack = []
    this.methods = {}
}


Route.prototype.dispatch = function dispatch(req, res, done) {
    const stack = this.stack
    let idx = 0
    next()

    function next(err) {
        if (err === 'route') {
            return done()
        }
        if (err === 'router') {
            return done(err)
        }
        let layer = stack[idx++]

        if(!layer){
            return done(err)
        }

        if (err) {
            layer.handle_error(err, req, res, next)
        } else {
            layer.handle_request(req, res, next)
        }
    }
}


Route.prototype._handle_method = function _handle_method(method) {
    return Boolean(this.methods[method])
}

methods.forEach(function (method) {
    Route.prototype[method] = function () {
        const callbacks = flatten(Array.prototype.slice.call(arguments))
        this.methods[method] = true
        for (const callback of callbacks) {
            const layer = Layer('/', {end: false}, callback)
            this.stack.push(layer)
        }
    }
})
