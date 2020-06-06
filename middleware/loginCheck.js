const {ErrorModel} = require('../model/resModel')
const {loginCheck} = require('../constants')

module.exports = (req, res, next) => {
    if (req.session.username || !loginCheck) {
        next()
        return
    }

    res.json(new ErrorModel('Error: Login Session Out.'))
}