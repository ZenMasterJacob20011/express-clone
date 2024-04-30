import qs from 'qs'

export default function query(options){
    return function (req, res, next){
        const qIndex = req.url.indexOf('?')
        req.query = qs.parse(req.url.substring(qIndex+1))
        next()
    }
}
