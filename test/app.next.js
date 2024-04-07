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
