import {describe, it} from "node:test";
import expressClone from "../index.js";
import request from "supertest";

describe('res.', () => {
    describe('sendStatus()', () => {
        it('should send OK in response body if passed 200', (t, done) => {
            const app = expressClone()
            app.get('/', (req, res) => {
                res.sendStatus(200)
            })
            request(app)
                .get('/')
                .expect(200)
                .expect('OK', done)
        });
        it('should send status code if unknown status code is passed', (t, done) => {
            const app = expressClone()
            app.get('/', (req, res) => {
                res.sendStatus(787)
            })
            request(app)
                .get('/')
                .expect(787)
                .expect('787', done)
        });
    });
    describe('type()', () => {
        it('should set the Content-Type to application/json if passed .json', (t, done) => {
            const app = expressClone()
            app.get('/', (req, res) => {
                res.type('.json')
                res.end('{}')
            })
            request(app)
                .get('/')
                .expect('Content-Type', 'application/json', done)
        });
        it('should set the Content-Type to application/json if passed json', (t, done) => {
            const app = expressClone()
            app.get('/', (req, res) => {
                res.type('json')
                res.end('{}')
            })
            request(app)
                .get('/')
                .expect('Content-Type', 'application/json', done)
        });
    });
    describe('set()', () => {
        it('should add charset to content-type', (t, done) => {
            const app = expressClone()
            app.get('/', (req, res) => {
                res.set('Content-Type', 'application/json')
                res.end()
            })
            request(app)
                .get('/')
                .expect('Content-Type', 'application/json; charset=utf-8', done)
        });
        it('should allow multiple values to be set on one field', (t, done) => {
            const app = expressClone()
            app.get('/', (req, res) => {
                res.set('Accept', ['application/json', 'json'])
                res.end()
            })
            request(app)
                .get('/')
                .expect('Accept', 'application/json, json', done)
        });
        it('should set the header given field and value', (t, done) => {
            const app = expressClone()
            app.get('/', (req, res) => {
                res.set('Content-Encoding', 'gzip')
                res.end()
            })
            request(app)
                .get('/')
                .expect('Content-Encoding', 'gzip', done)
        });
    })
    describe('status()', () => {
        it('should set the status code if passed code number', (t, done) => {
            const app = expressClone()
            app.get('/', (req, res) => {
                res.status(205)
                res.end()
            })
            request(app)
                .get('/')
                .expect(205, done)
        });
        it('should be able to chain with .send()', (t, done) => {
            const app = expressClone()
            app.get('/', (req, res) => {
                res.status(205).send('hello')
            })
            request(app)
                .get('/')
                .expect(205)
                .expect('hello', done)
        });
    });
});
