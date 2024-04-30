import {describe, it} from "node:test";
import expressClone from "../index.js";
import request from "supertest";

describe('req.', () => {
    describe('query', () => {
        it('should contain all the query parameters in a json object', (t, done) => {
            const app = expressClone()
            app.get('/test', (req, res) => {
                res.send(req.query)
            })
            request(app)
                .get('/test?test1=1&test2=2')
                .expect('{"test1":"1","test2":"2"}', done)
        });
    });
});
