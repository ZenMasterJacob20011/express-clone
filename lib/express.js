import mergeDescriptors from "merge-descriptors";
import proto from "./application.js";
import Router from './router/index.js'


export default function createApplication() {
    let app = function (req, res, next) {
        app.handle(req, res, next)
    }
    mergeDescriptors(app, proto)

    app.init();
    return app;
}

createApplication.Router = Router;
