const express = require('express')
const router = express.Router()

const {
    getMenuList,
    newMenuItem,
    delMenuItem,
    updateMenuItem
} = require('../controller/menu')

const {SuccessModel, ErrorModel} = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

/* GET list */
router.get('/menulist', (req, res, next) => {
    const result = getMenuList()
    return result.then(listData => {
        res.json(new SuccessModel(listData))
    })
})

/* POST newitem */
router.post('/newitem', loginCheck, (req, res, next) => {
    const itemName = req.body.itemname || ''
    const link = req.body.link || ''
    return newMenuItem(itemName, link).then((data) => {
        res.json(new SuccessModel(data))
    })
})

/* POST delitem */
router.post('/delitem', loginCheck, (req, res, next) => {
    const itemId = req.query.id || ''
    return delMenuItem(itemId).then(val => {
        if (val) {
            res.json(new SuccessModel('删除菜单名成功, id=' + itemId))
        } else {
            res.json(new ErrorModel('删除菜单名失败'))
        }
    })
})

/* POST updateitem */
router.post('/updateitem', loginCheck, (req, res, next) => {
    const itemId = req.query.id || ''
    const itemName = req.body.itemname || ''
    const link = req.body.link || ''
    return updateMenuItem(itemId, itemName, link).then(val => {
        if (val) {
            res.json(new SuccessModel('更新菜单名成功, id=' + itemId))
        } else {
            res.json(new ErrorModel('更新菜单名失败'))
        }
    })
})

module.exports = router