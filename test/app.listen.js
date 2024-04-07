import {describe, it} from "node:test";
import expressClone from "../index.js";

describe('app.listen()', () => {
    it('should wrap with an HTTP server', (t, done) => {
        const app = expressClone()
        const server = app.listen(0, function () {
            server.close(done);
        })
    });
});
