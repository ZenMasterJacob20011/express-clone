import http from "node:http";
import methods from "methods";
import Router from './router/index.js'
import {flatten} from "array-flatten";
import finalhandler from "finalhandler";
import Layer from "./router/layer.js";

let app = {}
const slice = Array.prototype.slice


app.handle = function handle(req, res, callback) {
    const router = this.router;
    callback = callback || finalhandler(req, res, {});
    router.handle(req, res, callback);
}

app.init = function init() {
    this.router = Router()
}

/**
 * Allow the proto to listen for req and res
 */
app.listen = function listen() {
    const server = http.createServer(this)
    return server.listen(...arguments)
}

methods.forEach(function (method) {
    app[method] = function (path) {
        this.router.route(path, method, flatten(slice.call(arguments, 1)));
    }
})

app.use = function use() {
    if (typeof arguments[0] === 'string') {
        const path = arguments[0]
        const middlewares = flatten(slice.call(arguments, 1))
        this.router.route(path, undefined, middlewares)
        return
    }
    const middlewares = flatten(slice.call(arguments))
    this.router.route(undefined, undefined, middlewares);
}


export default app
