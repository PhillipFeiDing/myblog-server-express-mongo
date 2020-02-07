const express = require('express')
const router = express.Router()

const {
    getList,
    getPageCount,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
} = require('../controller/blog')

const {SuccessModel, ErrorModel} = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

/* GET list. */
router.get('/list', (req, res, next) => {
    let author = req.query.author || ''
    const keyword = req.query.keyword || ''
    const tagId = req.query.tag || ''
    const page = req.query.page || ''

    if (req.query.isadmin) {
        // 管理员界面
        if (req.session.username == null) {
            // 未登录
            res.json(new ErrorModel('未登录'))
            return
        }

        // 强制查询自己的博客
        author = req.session.username
    }

    const result = getList(author, keyword, tagId, page) // 返回的是 Promise
    return result.then(listData => {
        res.json(new SuccessModel(listData))
    })
})

/* GET pagecount */
router.get('/pagecount', (req, res, next) => {
    let author = req.query.author || ''
    const keyword = req.query.keyword || ''
    const tagId = req.query.tag || ''
    
    const result = getPageCount(author, keyword, tagId)
    return result.then(data => {
        res.json(new SuccessModel(data))
    })
})

/* GET detali. */
router.get('/detail', (req, res, next) => {
    const id = req.query.id
    const result = getDetail(id)
    return result.then(data => {
        res.json(new SuccessModel(data))
    })
})

/* POST new. */
router.post('/new', loginCheck, (req, res, next) => {
    req.body.author = req.session.username
    const result = newBlog(req.body)
    return result.then(data => {
        res.json(new SuccessModel(data))
    })
})

/* POST edit. */
router.post('/update', loginCheck, (req, res, next) => {
    const id = req.query.id
    const result = updateBlog(id, req.body)
    return result.then(val => {
        if (val) {
            res.json(new SuccessModel())
        } else {
            res.json(new ErrorModel("更新博客失败"))
        }
    })
})

/* POST del. */
router.post('/del', loginCheck, (req, res, next) => {
    const id = req.query.id
    const author = req.session.username
    const result = delBlog(id, author)
    return result.then(val => {
        if (val) {
            res.json(new SuccessModel("删除博客成功 id=" + id))
        } else {
            res.json(new ErrorModel("删除博客失败"))
        }
    })
})

module.exports = router