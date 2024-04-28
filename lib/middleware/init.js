import setPrototypeOf from "setprototypeof";

export default function init(app) {
    return function middlewareFN(req, res, next) {
        setPrototypeOf(res, app.response)
        next()
    }
}
