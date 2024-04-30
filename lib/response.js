import http from 'node:http'
import statuses from 'statuses'
import send from 'send'

const mime = send.mime
const charsetRegExp = /;\s*charset\s*=/


let res = Object.create(http.ServerResponse.prototype)
export default res

/**
 * Sets the status code and sends the status code as a message or numeric string in the body
 * @param {Number} statusCode
 */
res.sendStatus = function sendStatus(statusCode) {
    const status = statuses.message[statusCode]
        ? statuses.message[statusCode]
        : String(statusCode)
    this.statusCode = statusCode
    this.end(status)
    return this
}

/**
 * Set status `code`.
 *
 * @param {Number} status
 * @return {ServerResponse}
 * @public
 */
res.status = function status(status) {
    if (typeof status === 'string') {
        console.warn(`deprecated res.status(\'${status}\'): use res.status(${status}) instead`)
        try {
            status = Number(status)
        } catch (err) {
            throw new TypeError(err)
        }
    }
    this.statusCode = status
    return this
}


/**
 *
 * @param {String} type
 * @return {ServerResponse} for chaining
 */
res.type = function contentType(type) {
    const ct = type.indexOf('/') === -1
        ? mime.lookup(type)
        : type
    return this.setHeader('Content-Type', ct)
}


/**
 * Set header `field` to `val`, or pass
 * an object of header fields.
 *
 * Examples:
 *
 *    res.set('Foo', ['bar', 'baz']);
 *    res.set('Accept', 'application/json');
 *    res.set({ Accept: 'text/plain', 'X-API-Key': 'tobi' });
 *
 * Aliased as `res.header()`.
 *
 * @param {String|Object} field
 * @param {String|Array} val
 * @return {ServerResponse} for chaining
 * @public
 */
res.set =
    res.header = function header(field, val) {
        if (arguments.length === 2) {
            let value = Array.isArray(val)
                ? val.map(String)
                : String(val)
            if (field.toLowerCase() === 'content-type') {
                if (Array.isArray(value)) {
                    throw new TypeError('Cannot set content-type to multiple values')
                }
                if (!charsetRegExp.test(value)) {
                    const charset = mime.charsets.lookup(value.split(';')[0]);
                    if (charset) value += '; charset=' + charset.toLowerCase()
                }
            }
            this.setHeader(field, value)
        } else {
            for (const fieldKey in field) {
                this.set(fieldKey, field[fieldKey])
            }
        }
        return this
    }
/**
 * returns the value of the header for the field, otherwise undefined
 * @param {string} field
 * @returns {string}
 */
res.get = function (field) {
    return this.getHeader(field)
}

/**
 * Send a response.
 *
 * Examples:
 *
 *     res.send(Buffer.from('wahoo'));
 *     res.send({ some: 'json' }); should have content-type as json
 *     res.send('<p>some html</p>') should have content-type as html;
 *
 * @param {string|number|boolean|object|Buffer} body
 * @public
 */
res.send = function send(body) {
    let chunk = body

    if (arguments.length === 2) {
        if (typeof arguments[0] !== 'number' && typeof arguments[1] === 'number') {
            console.warn('deprecated res.send(body, status): Use res.status(status).send(body) instead')
            this.statusCode = chunk
        } else {
            console.warn('deprecated res.send(status, body): Use res.status(status).send(body) instead')
        }
    }

    switch (typeof chunk) {
        case "string":
            this.type('html')
            break
        case "number":
            if (arguments.length !== 2) {
                console.warn('deprecated res.send(status): Use res.sendStatus(status) instead')
                this.statusCode = chunk
            }
            chunk = statuses.message[chunk]
            break
        case "object":
            if (Buffer.isBuffer(chunk)) {
                this.type('oclet-stream')
                chunk = Buffer.from(chunk).toString()
            } else {
                this.type('json')
                chunk = JSON.stringify(chunk)
            }
    }
    this.end(chunk)
    return this
}

function sendfile(res, file, opts, callback) {

    function onerror(err) {
        callback(err)
    }

    file.on('error', onerror)

    file.pipe(res)
}

/**
 * Transfer the file at the given `path`.
 *
 * Automatically sets the _Content-Type_ response header field.
 * The callback `callback(err)` is invoked when the transfer is complete
 * or when an error occurs. Be sure to check `res.headersSent`
 * if you wish to attempt responding, as the header and some data
 * may have already been transferred.
 *
 * Options:
 *
 *   - `maxAge`   defaulting to 0 (can be string converted by `ms`)
 *   - `root`     root directory for relative filenames
 *   - `headers`  object of headers to serve with file
 *   - `dotfiles` serve dotfiles, defaulting to false; can be `"allow"` to send them
 *
 * Other options are passed along to `send`.
 *
 * Examples:
 *
 *  The following example illustrates how `res.sendFile()` may
 *  be used as an alternative for the `static()` middleware for
 *  dynamic situations. The code backing `res.sendFile()` is actually
 *  the same code, so HTTP cache support etc is identical.
 *
 *     app.get('/user/:uid/photos/:file', function(req, res){
 *       var uid = req.params.uid
 *         , file = req.params.file;
 *
 *       req.user.mayViewFilesFrom(uid, function(yes){
 *         if (yes) {
 *           res.sendFile('/uploads/' + uid + '/' + file);
 *         } else {
 *           res.send(403, 'Sorry! you cant see that.');
 *         }
 *       });
 *     });
 * @param path {String}
 * @param options {Object}
 * @public
 */
res.sendFile = function sendFile(path, options) {
    const req = this.req
    const res = this
    const next = req.next
    const opts = options || {}
    if (!path) {
        throw new TypeError('path is required for res.sendFile')
    }
    if (typeof path !== 'string') {
        throw new TypeError('path must be of type string for res.sendFile')
    }
    const file = send(req, path, opts)
    sendfile(res, file, opts, function (err) {
        if (err) {
            next(err)
        }
    })
}
