import supertest from 'supertest'
import {describe, it} from "node:test";
import assert from "node:assert";
import request from 'supertest'
import expressClone from "../index.js";

describe('app.', () => {

    it('get("/", (req, res)=> {}) should create a new layer on the router stack', () => {
        const app = expressClone()
        app.get("/", (req, res) => {
        })
        assert.strictEqual(app.router.stack[1].path, "/")
    });
});

describe("req.", () => {
    const app = expressClone()

    app.get("/", (req, res) => {
        res.end("hello from get")
    })
    app.post("/", (req, res) => {
        res.end("hello from post");
    })
    app.put("/", (req, res) => {
        res.end("hello from put");
    })
    app.delete("/", (req, res) => {
        res.end("hello from delete");
    })

    it('get("/") should return "hello from get" in response body', (t, done) => {
        request(app)
            .get("/")
            .expect(200)
            .expect("hello from get", done)
    });
    it('post("/") should return "hello from post" in response body', (t, done) => {
        request(app)
            .post("/")
            .expect(200)
            .expect("hello from post", done)
    });
    it('put("/") should return "hello from put" in response body', (t, done) => {
        request(app)
            .put("/")
            .expect(200)
            .expect("hello from put", done)
    });
    it('delete("/") should return "hello from delete" in response body', (t, done) => {
        request(app)
            .delete("/")
            .expect(200)
            .expect("hello from delete", done)
    });
})
