const express = require('express')
const router = express.Router()

const legalURLs = [
    '/index',
    '/home',
    '/detail/:id',
    '/admin'
]

legalURLs.map(url => {
    router.get(url, (req, res, next) => {
        res.sendFile('index.html', {root: __dirname + '/../public'})
    })
})

module.exports = router