const express = require('express')
const router = express.Router()

const {
    login
} = require("../controller/user")

const {SuccessModel, ErrorModel} = require("../model/resModel")

/* POST login */
router.post('/login', (req, res, next) => {
    const {email, password} = req.body
    const result = login(email, password)
    return result.then(data => {
        if (data.username) {
            // 操作cookie 设置httpOnly禁止修改
            req.session.username = data.username
            res.json(new SuccessModel("Login Successful."))
            return
        }
        res.json(new ErrorModel("Login Failed."))
    })
})

module.exports = router