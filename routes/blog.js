const express = require('express')
const router = express.Router()

const {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog
} = require('../controller/blog')

const {SuccessModel, ErrorModel} = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

/* GET list. */
router.get('/list', (req, res, next) => {
    if (req.query.isadmin) {
        // 管理员界面
        if (req.session.username == null) {
            // 未登录
            res.json(new ErrorModel('Login Session Expired.'))
            return
        }
    }
    const result = getList() // 返回的是 Promise
    return result.then(listData => {
        res.json(new SuccessModel(listData))
    })
})

/* GET detail */
router.get('/detail', (req, res, next) => {
    const id = req.query.id
    const result = getDetail(id)
    return result.then(data => {
        res.json(new SuccessModel(data))
    }).catch(error => {
        res.json(new ErrorModel(error.toString()))
    })
})

/* POST new */
router.post('/new', loginCheck, (req, res, next) => {
    const result = newBlog()
    return result.then((val) => {
        if (val) {
            res.json(new SuccessModel(`Successfully created blog, returned ID: ${val.id}`))
        } else {
            res.json(new ErrorModel('Failed to create a new blog.'))
        }
    })
})

/* POST edit */
router.post('/update', loginCheck, (req, res, next) => {
    const result = updateBlog(req.body.submit)
    return result.then(val => {
        if (val) {
            res.json(new SuccessModel(`Successfully updated blog with ID ${req.body.submit.id}.`))
        } else {
            res.json(new ErrorModel(`Failed to update blog with ID ${req.body.submit.id}.`))
        }
    })
})

/* POST delete */
router.post('/delete', loginCheck, (req, res, next) => {
    const result = deleteBlog(req.body.blogId)
    return result.then(val => {
        if (val) {
            res.json(new SuccessModel("Successfully deleted blog with ID " + req.body.blogId + "."))
        } else {
            res.json(new ErrorModel("Failed to delete blog with ID " + req.body.blogId + "."))
        }
    })
})



module.exports = router