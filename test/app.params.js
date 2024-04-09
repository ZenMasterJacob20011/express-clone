import {describe, it} from "node:test";
import expressClone from "../index.js";
import request from "supertest";
import assert from "node:assert";

describe('app.get("/:foo", ...)', () => {
    const app = expressClone()
    app.get("/:foo", (req, res) => {
        res.end("hello")
    })
    it('should match any get request string past the slash', (t, done) => {
        request(app)
            .get("/bar")
            .expect(200)
            .end(function () {
                request(app)
                    .get("/foo/")
                    .expect(200)
                    .end(done)
            })
    });
    it('should not match /foo/bar', (t, done) => {
        request(app)
            .get("/bar/foo")
            .expect(404)
            .end(done)
    });
});

describe('app.get', () => {
    describe('("/:foo", ...)', () => {
        it('should create a key foo in req.params and store its value as test', (t, done) => {
            const app = expressClone()
            app.get("/:foo", (req, res) => {
                res.end(req.params.foo)
            })
            request(app)
                .get("/test")
                .expect("test")
                .end(done);
        });
    });
    describe('("/:foo/:bar", ...)', () => {
        it('should have an Object.keys length of 2 for req.params', (t, done) => {
            const app = expressClone()
            app.get("/:foo/:bar", (req, res) => {
                res.end(Object.keys(req.params).length.toString())
            })
            request(app)
                .get("/test/test2")
                .expect("2")
                .end(done)
        });
        it('should store test for req.params.foo and test2 for req.params.bar', (t, done) => {
            const app = expressClone()
            app.get("/:foo/:bar", (req, res) => {
                res.write(req.params.foo)
                res.end(req.params.bar)
            })
            request(app)
                .get("/test/test2")
                .expect("testtest2")
                .end(done)
        });
    });
    describe('("/:foo/bar", ...)', () => {
        it('should have an Object.keys length of 1 for req.params', (t, done) => {
            const app = expressClone()
            app.get("/:foo/bar", (req, res) => {
                res.end(Object.keys(req.params).length.toString())
            })
            request(app)
                .get("/test/bar")
                .expect("1")
                .end(done)
        });
    });
});
