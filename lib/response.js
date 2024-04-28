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
