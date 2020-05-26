const {ErrorModel} = require('../model/resModel')

module.exports = (req, res, next) => {
    if (req.session.username) {
        next()
        return
    }

    res.json(new ErrorModel('Error: Login Session Out.'))
}