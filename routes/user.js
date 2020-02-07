const express = require('express')
const router = express.Router()

const {
    login
} = require("../controller/user")

const {SuccessModel, ErrorModel} = require("../model/resModel")

/* POST login */
router.post('/login', (req, res, next) => {
    const {username, password} = req.body
    // const {username, password} = req.query
    const result = login(username, password)
    return result.then(data => {
        if (data.username) {
            // 操作cookie 设置httpOnly禁止修改
            req.session.username = data.username
            req.session.realname = data.realname
            res.json(new SuccessModel("登录成功"))
            return
        }
        res.json(new ErrorModel("登录失败"))
    })
})

module.exports = router