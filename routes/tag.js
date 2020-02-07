const express = require('express')
const router = express.Router()

const {
    newTag,
    getTagList,
    delTag
} = require('../controller/tag')

const {SuccessModel, ErrorModel} = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

/* GET taglist */
router.get('/taglist', (req, res, next) => {
    const result = getTagList()
    return result.then(listData => {
        res.json(new SuccessModel(listData))
    })
})

/* POST newtag */
router.post('/newtag', loginCheck, (req, res, next) => {
    const tagName = req.query.tagname
    const result = newTag(tagName)
    return result.then(data => {
        if (data) {
            res.json(new SuccessModel(data))
        } else {
            res.json(new ErrorModel('添加标签失败：重复标签'))
        }
    })
})

/* POST deltag */
router.post('/deltag', loginCheck, (req, res, next) => {
    const tagId = req.query.id
    const result = delTag(tagId)
    return result.then(val => {
        if (val) {
            res.json(new SuccessModel('删除标签成功'))
        } else {
            res.json(new ErrorModel('删除标签失败：不存在标签'))
        }
    })
})

module.exports = router