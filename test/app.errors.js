import {describe, it} from "node:test";
import expressClone from "../index.js";
import request from "supertest";

describe('When app.get throws an error', () => {
    describe('the response', () => {
        it('should contain the error message with a status of 500', (t, done) => {
            const app = expressClone()
            app.get('/', (req, res) => {
                throw new Error('special error message')
            })

            request(app)
                .get('/')
                .expect(500, /special error message/, done)
        });
    });
});
