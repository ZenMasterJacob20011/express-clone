export default function Layer(path, method, options, fn) {
    if (!(this instanceof Layer)) {
        return new Layer(path, method, options, fn)
    }
    this.method = method
    this.path = path
    this.handle = fn
}


Layer.prototype.match = function match(path, method) {
    const layerPath = this.path
    const layerMethod = this.method
    if(!layerPath && !layerMethod){
        return true
    }else if (!layerPath){
        return layerMethod === method
    }else if (!layerMethod){
        return layerPath === path
    }
    return path === this.path && method === this.method;
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
