import {describe, it} from "node:test";
import expressClone from "../index.js";
import request from "supertest";

describe('router.get("/routerpath", ...)', () => {
    const app = expressClone()
    const router = expressClone.Router();
    router.get("/routerpath", (req, res) => {
        res.end("hello from routerpath")
    })
    app.use("/mainpath", router)
    it('should respond to get requests to the path /mainpath/routerpath', (t, done) => {
        request(app)
            .get("/mainpath/routerpath")
            .expect("hello from routerpath")
            .end(done)
    });
    it('should respond with status code 404 to get requests to the path /mainpath/altpath', (t, done) => {
        request(app)
            .get('/mainpath/altpath')
            .expect(404)
            .end(done)
    });
    it('should respond with status code 404 to get requests to the path /mainpath', (t, done) => {
        request(app)
            .get('/mainpath')
            .expect(404)
            .end(done)
    });
});

describe('router should be able to handle', () => {
    it('multiple methods', (t, done) => {
        const app = expressClone()
        const router = expressClone.Router()
        router.get('/getpath', (req, res) => {
            res.end('helloget')
        })
        router.post('/postpath', (req, res) => {
            res.end('hellopost')
        })
        app.use('/mainpath', router)

        request(app)
            .get('/mainpath/getpath')
            .expect('helloget')
            .end(function () {
                request(app)
                    .post('/mainpath/postpath')
                    .expect('hellopost')
                    .end(done)
            })
    });
    it('multiple middleware functions', (t, done) => {
        const app = expressClone()
        const router = expressClone.Router()
        router.get('/getpath', (req, res, next) => {
            res.write('part1\n')
            next();
        }, (req, res) => {
            res.end('part2')
        })
        app.use('/mainpath', router)
        request(app)
            .get('/mainpath/getpath')
            .expect('part1\npart2')
            .end(done)
    });
    it('paths with parameters', (t, done) => {
        const app = expressClone()
        const router = expressClone.Router()
        router.get('/:foo/:bar', (req, res) => {
            res.write(req.params.foo + '\n')
            res.end(req.params.bar)
        })
        app.use('/mainpath', router)
        request(app)
            .get('/mainpath/hello/there')
            .expect('hello\nthere')
            .end(function () {
                request(app)
                    .get('/mainpath/hello')
                    .expect(404)
                    .end(function () {
                        request(app)
                            .get('/mainpath/hello/there/me')
                            .expect(404)
                            .end(done)
                    })
            })
    });
    it('app.use with two path prefixes', (t, done) => {
        const app = expressClone()
        const router = expressClone.Router()
        router.get('/routerpath', (req, res) => {
            res.end('hello')
        })
        app.use('/mainpath/secondpath', router)
        request(app)
            .get('/mainpath/secondpath/routerpath')
            .expect('hello')
            .end(done)
    });
});
