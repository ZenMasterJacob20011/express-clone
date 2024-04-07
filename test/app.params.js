import {describe, it} from "node:test";
import expressClone from "../index.js";
import request from "supertest";

describe('app.get("/:foo")', () => {
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
