const express = require('express')
const axios = require('axios')
const router = express.Router()

const {
    getList,
    getPageCount,
    getDetail,
    newBlog,
    updateBlog,
    delBlog,
    makeComment,
    getComment
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

/* GET oauth */
const clientID = '9f872687649b6af95b8d'
const clientSecret = '1a37f26634785af81817d43ddf049266553f54a1'
router.get('/oauth/redirect', (req, res, next) => {
    const requestToken = req.query.code
    axios({
        method: 'post',
        url: 'https://github.com/login/oauth/access_token?' +
          `client_id=${clientID}&` +
          `client_secret=${clientSecret}&` +
          `code=${requestToken}`,
        headers: {
          accept: 'application/json'
        }
    }).then((tokenResponse) => {
        const accessToken = tokenResponse.data.access_token
        axios({
            method: 'get',
            url: `https://api.github.com/user`,
            headers: {
              accept: 'application/json',
              Authorization: `token ${accessToken}`
            }
        }).then((result) => {
            const cookieAge = 24 * 60 * 60 * 1000
            res.cookie('githubUsername-secure', result.data.login, { maxAge: cookieAge, httpOnly: true })
            res.cookie('githubUserURL-secure', result.data.html_url, { maxAge: cookieAge, httpOnly: true })
            res.cookie('githubAvatarURL-secure', result.data.avatar_url, { maxAge: cookieAge, httpOnly: true })
            res.cookie('githubUsername', result.data.login, { maxAge: cookieAge})
            res.cookie('githubUserURL', result.data.html_url, { maxAge: cookieAge})
            res.cookie('githubAvatarURL', result.data.avatar_url, { maxAge: cookieAge})
            res.redirect(req.cookies.oauthRedirectURL)
        })
    })
})

router.post('/make-comment', (req, res, next) => {
    req.body.githubUsername = req.cookies['githubUsername-secure']
    req.body.githubUserURL = req.cookies['githubUserURL-secure']
    req.body.githubAvatarURL = req.cookies['githubAvatarURL-secure']
    const result = makeComment(req.body)
    return result.then(val => {
        if (val) {
            res.json(new SuccessModel("评论成功"))
        } else {
            res.json(new ErrorModel("评论失败"))
        }
    })
})

router.get('/get-comment', (req, res, next) => {
    const blogid = req.query.blogid || ''
    const result = getComment(blogid)
    return result.then(data => {
        res.json(new SuccessModel(data))
    })
})

module.exports = router