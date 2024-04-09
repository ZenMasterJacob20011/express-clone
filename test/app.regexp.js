import {describe, it} from "node:test";
import expressClone from "../index.js";
import request from "supertest";

describe('app.get("/ab?cd", ...', () => {
    const app = expressClone()
    app.get("/ab?cd", (req, res) => {
        res.end("ab?cd")
    })
    it('should match path acd', (t, done) => {
        request(app)
            .get("/acd")
            .expect("ab?cd")
            .end(done)
    });
    it('should match path abcd', (t, done) => {
        request(app)
            .get("/abcd")
            .expect("ab?cd")
            .end(done)
    });
    it('should not match path cd', (t, done) => {
        request(app)
            .get("/cd")
            .expect(404)
            .end(done)
    });
});

describe('app.get("ab+cd", ...', () => {
    const app = expressClone()
    app.get("/ab+cd", (req, res) => {
        res.end("ab+cd")
    })
    it('should match path abcd', (t, done) => {
        request(app)
            .get("/abcd")
            .expect("ab+cd")
            .end(done)
    });
    it('should match path abbcd', (t, done) => {
        request(app)
            .get("/abbcd")
            .expect("ab+cd")
            .end(done)
    });
    it('should not match path acd', (t, done) => {
        request(app)
            .get("/acd")
            .expect(404)
            .end(done)
    });
});

describe('app.get("/ab*cd", ...)', () => {
    const app = expressClone()
    app.get("/ab*cd", (req, res) => {
        res.end("ab*cd")
    })
    it('should match path abcd', (t, done) => {
        request(app)
            .get("/abcd")
            .expect("ab*cd")
            .end(done)
    });
    it('should match path abxcd', (t, done) => {
        request(app)
            .get("/abxcd")
            .expect("ab*cd")
            .end(done)
    });
    it('should match path abRANDOMcd', (t, done) => {
        request(app)
            .get("/abRANDOMcd")
            .expect("ab*cd")
            .end(done)
    });
    it('should match path ab123cd', (t, done) => {
        request(app)
            .get("/ab123cd")
            .expect("ab*cd")
            .end(done)
    });
    it('should not match path ab123d', (t, done) => {
        request(app)
            .get("/ab123d")
            .expect(404)
            .end(done)
    });
});

describe('app.get("/ab(cd)?e, ...")', () => {
    const app = expressClone()
    app.get("/ab(cd)?e", (req, res) => {
        res.end("ab(cd)?e")
    })
    it('should match path abe', (t, done) => {
        request(app)
            .get("/abe")
            .expect("ab(cd)?e")
            .end(done)
    });
    it('should match path abcde', (t, done) => {
        request(app)
            .get("/abcde")
            .expect("ab(cd)?e")
            .end(done)
    });
    it('should not match path abce', (t, done) => {
        request(app)
            .get("/abce")
            .expect(404)
            .end(done)
    });
});

describe('app.get(/a/, ...)', () => {
    const app = expressClone()
    app.get(/a/, (req, res) => {
        res.end("/a/")
    })
    it('should match path apple', (t, done) => {
        request(app)
            .get("/apple")
            .expect("/a/")
            .end(done)
    });
    it('should match path pale', (t, done) => {
        request(app)
            .get("/pale")
            .expect("/a/")
            .end(done)
    });
    it('should not match path foo', (t, done) => {
        request(app)
            .get("/foo")
            .expect(404)
            .end(done)
    });
});

describe('app.get(/.*fly$/, ...)', () => {
    const app = expressClone()
    app.get(/.*fly$/, (req, res) => {
        res.end("/.*fly$/")
    })
    it('should match path butterfly', (t, done) => {
        request(app)
            .get("/butterfly")
            .expect("/.*fly$/")
            .end(done)
    });
    it('should match path dragonfly', (t, done) => {
        request(app)
            .get("/dragonfly")
            .expect("/.*fly$/")
            .end(done)
    });
    it('should not match path butterflyman', (t, done) => {
        request(app)
            .get("/butterflyman")
            .expect(404)
            .end(done)
    });
});

