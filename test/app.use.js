import {describe, it} from "node:test";
import expressClone from "../index.js";
import request from "supertest";
import serveStatic from "serve-static";
import path from "node:path";

describe('app.use', () => {
    it('(req,res,next) should run for all methods of requests', (t, done) => {
        const app = expressClone();
        app.use((req, res) => {
            res.end(req.method.toLowerCase());
        })
        const agent = request(app)
        agent
            .get("/")
            .expect('get')
            .end(function () {
                agent
                    .post("/")
                    .expect('post')
                    .end(function () {
                        agent.put("/")
                            .expect('put')
                            .end(function () {
                                agent.delete("/")
                                    .expect('delete')
                                    .end(done)
                            })
                    })
            })
    });
    it('should be able to handle multiple middleware functions', (t, done) => {
        const app = expressClone()
        app.use((req, res, next) => {
            res.write("1\n")
            next()
        }, (req, res, next) => {
            res.write("2\n")
            next()
        }, (req, res) => {
            res.end("3")
        })

        request(app)
            .get("/")
            .expect("1\n2\n3")
            .end(done)
    });
    it('("/usePath") should handle any path first', (t, done) => {
        const app = expressClone();
        app.get("/", (req, res) => {
            res.end("this should not run")
        })
        app.use("/usePath", (req, res, next) => {
            res.write("I run first\n")
            next();
        })
        app.get("/usePath", (req, res) => {
            res.end("get run last")
        })
        app.post("/usePath", (req, res) => {
            res.end("post run last")
        })

        request(app)
            .get("/usePath")
            .expect("I run first\nget run last")
            .end(function () {
                request(app)
                    .post("/usePath")
                    .expect("I run first\npost run last")
                    .end(done)
            })
    });
    it('should be able to serve static files', (t, done) => {
        const __dirname = import.meta.dirname
        const app = expressClone(path.join(__dirname, 'fixtures'))
        app.static = serveStatic
        app.use(app.static(path.join(__dirname, 'fixtures')))

        request(app)
            .get('/firstpage.html')
            .expect(200)
            .end(done)
    });
});


