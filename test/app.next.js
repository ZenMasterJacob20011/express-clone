import {describe, it} from "node:test";
import request from 'supertest'
import expressClone from "../index.js";

describe('app.get("/", req, res, next)', () => {
    const app = expressClone();
    app.get("/", (req, res, next) => {
        res.write("get1\n")
        next();
    })
    app.get("/", (req, res) => {
        res.end("get2")
    })
    it('should call the next app.get("/", (req, res)) when next() is called', (t, done) => {
        request(app)
            .get("/")
            .expect("get1\nget2")
            .end(done);
    });
});

describe('app.METHOD()', () => {
    const app = expressClone();
    app.get("/", (req, res, next) => {
        res.write("get 1\n")
        next();
    }, (req, res, next) => {
        res.write("get 2\n")
        next();
    }, (req, res, next) => {
        res.end("get 3")
    })
    it('should be able to handle an array of middleware functions', (t, done) => {
        request(app)
            .get("/")
            .expect("get 1\nget 2\nget 3")
            .end(done)
    });
});

describe("next('route')", () => {
    it('should skip all remaining route handlers', (t, done) => {
        const app = expressClone()
        app.get('/', (req, res, next) => {
            res.write('hello1\n')
            next('route')
        }, (req, res, next) => {
            res.end('hello2')
        })

        app.get('/', (req, res, next) => {
            res.end('skip')
        })

        request(app)
            .get('/')
            .expect('hello1\nskip', done)
    });
});


describe("next('router')", () => {
    it('should skip all remaining routes in the router', (t, done) => {
        const app = expressClone()
        const router = expressClone.Router()

        router.get('/', (req, res, next) => {
            res.write('1\n')
            next()
        })

        router.use((req, res, next) => {
            res.write('2\n')
            next('router')
        })

        router.get('/', (req, res, next) => {
            res.write('I should not run')
            next()
        })

        app.use('/myrouter', router)

        app.use((req, res) => {
            res.end('the end')
        })

        request(app)
            .get('/myrouter')
            .expect('1\n2\nthe end', done)
    });
});
