import {describe, it} from "node:test";
import expressClone from "../index.js";
import request from "supertest";

describe('app', () => {
    it('should handle all the express clone functions at the same time', (t, done) => {
        const app = expressClone()
        const router1 = expressClone.Router()

        function getMeOut(req, res, next) {
            res.write('leaving\n')
            next('router')
        }

        router1.use('/out', getMeOut)

        router1.post('/:param1/hi', (req, res) => {
            res.send(req.params.param1)
        })

        router1.get('/:any', (req, res, next) => {
            if (req.params.any === 'skip') return next('route')
            res.write('hello1\n')
            next()
        }, (req, res, next) => {
            res.write('hello2\n')
            next()
        }, (req, res, next) => {
            res.end('hello3')
        })

        router1.get('/skip', (req, res) => {
            res.end('hello4')
        })

        const router2 = expressClone.Router()

        router2.delete(/.*/, (req, res, next) => {
            res.write('inside router2\n')
            next()
        })

        app.use('/router1', router1)
        app.use('/router2', router2)

        app.get('/', (req, res, next) => {
            res.write('get1\n')
            next()
        })

        app.post('/', (req, res) => {
            res.write('post1\n')
        })

        app.get('/router1', (req, res) => {
            res.end('end')
        })
        app.get('/router2', (req, res) => {
            res.end('end')
        })
        app.get('/router1/out', (req, res) => {
            res.end('end')
        })

        app.get('/', (req, res) => {
            res.end('get2')
        })

        app.delete('/router2/r1a2n3d4o5m', (req, res) => {
            res.end('end')
        })


        request(app)
            .get('/router1/out')
            .expect('leaving\nend', function () {
                request(app)
                    .get('/router1/test1')
                    .expect('hello1\nhello2\nhello3', function () {
                        request(app)
                            .get('/')
                            .expect('get1\nget2', function () {
                                request(app)
                                    .post('/router1/test2/hi')
                                    .expect('test2', function () {
                                        request(app)
                                            .get('/router1/skip')
                                            .expect('hello4', function () {
                                                request(app)
                                                    .delete('/router2/r1a2n3d4o5m')
                                                    .expect('inside router2\nend', done)
                                            })
                                    })
                            })
                    })
            })
    });
});
