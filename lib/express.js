import mergeDescriptors from "merge-descriptors";
import proto from "./application.js";

export default function createApplication(){
    let app = function (req, res, next){
        app.handle(req, res, next)
    }
    mergeDescriptors(app, proto)

    app.init();

    return app;
}
