import mergeDescriptors from "merge-descriptors";
import proto from "./application.js";
import Router from './router/index.js'
import res from "./response.js";
import serveStatic from "serve-static";

export default function createApplication() {
    let app = function (req, res, next) {
        app.handle(req, res, next)
    }

    app.response = Object.create(res)

    mergeDescriptors(app, proto)
    app.init();
    return app;
}

createApplication.Router = Router;

createApplication.static = serveStatic
