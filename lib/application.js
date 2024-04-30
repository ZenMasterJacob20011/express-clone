import http from "node:http";
import methods from "methods";
import Router from './router/index.js'
import {flatten} from "array-flatten";
import finalhandler from "finalhandler";
import middleware from './middleware/init.js'
import query from './middleware/query.js'

let app = {}
const slice = Array.prototype.slice


app.handle = function handle(req, res, callback) {
    const router = this.router;
    callback = callback || finalhandler(req, res, {});
    router.handle(req, res, callback);
}

app.init = function init() {

}

app.lazyrouter = function lazyrouter() {
    if (!this.router){
        this.router = new Router()
        this.use(query())
        this.use(middleware(this))
    }
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
        this.lazyrouter()
        const route = this.router.route(path);
        route[method].apply(route, flatten(slice.call(arguments, 1)))
    }
})

app.use = function use() {
    this.lazyrouter()
    let router = this.router
    if (typeof arguments[0] === 'string') {
        const path = arguments[0]
        const middlewares = flatten(slice.call(arguments, 1))
        for (const middleware of middlewares) {
            router.use(path, middleware)
        }
        return
    }
    const middlewares = flatten(slice.call(arguments))
    for (const middleware of middlewares) {
        router.use(middleware)
    }
}


export default app
