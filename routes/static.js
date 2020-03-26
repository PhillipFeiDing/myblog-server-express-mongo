const express = require('express')
const router = express.Router()

router.get('/index', (req, res, next) => {
    res.sendFile('index.html')
})

module.exports = router