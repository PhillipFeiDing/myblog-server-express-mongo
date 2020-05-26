const express = require('express')
const router = express.Router()

const {
    getTopicList,
    newTopicItem,
    deleteTopicItem,
    updateTopicItem,
    getFriendList,
    newFriendItem,
    deleteFriendItem,
    updateFriendItem
} = require('../controller/menu')

const {SuccessModel, ErrorModel} = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

/* GET topic list */
router.get('/topic/list', (req, res, next) => {
    const result = getTopicList()
    return result.then(listData => {
        res.json(new SuccessModel(listData))
    })
})

/* POST topic new */
router.post('/topic/new', loginCheck, (req, res, next) => {
    const topicName = req.body.blogTopic || ''
    const blogId = req.body.blogId || ''
    const result = newTopicItem(topicName, blogId)
    return result.then((val) => {
        if (val) {
            res.json(new SuccessModel(`Successfully created topic, returned ID: ${val.id}`))
        } else {
            res.json(new ErrorModel('Failed to create a new topic.'))
        }
    })
})

/* POST topic delete */
router.post('/topic/delete', loginCheck, (req, res, next) => {
    const topicId = req.body.pinnedId
    const result = deleteTopicItem(topicId)
    return result.then((val) => {
        if (val) {
            res.json(new SuccessModel(`Successfully deleted topic with ID: ${topicId}`))
        } else {
            res.json(new ErrorModel(`Failed to delete topic with ID: ${topicId}.`))
        }
    })
})

/* POST topic udpate */
router.post('/topic/update', loginCheck, (req, res, next) => {
    const id = req.body.pinnedId
    const blogId = req.body.blogId || ''
    const topicName = req.body.topicName || ''
    return updateTopicItem(id, blogId, topicName).then((val) => {
        if (val) {
            res.json(new SuccessModel(`Successfully updated topic with ID: ${id}`))
        } else {
            res.json(new ErrorModel(`Failed to update topic with ID: ${id}.`))
        }
    })
})

/* GET friend list */
router.get('/friend/list', (req, res, next) => {
    const result = getFriendList()
    return result.then(listData => {
        res.json(new SuccessModel(listData))
    })
})

/* POST friend new */
router.post('/friend/new', loginCheck, (req, res, next) => {
    const friendName = req.body.friendName || ''
    const link = req.body.link || ''
    const result = newFriendItem(friendName, link)
    return result.then((val) => {
        if (val) {
            res.json(new SuccessModel(`Successfully created a friend, returned ID: ${val.id}`))
        } else {
            res.json(new ErrorModel('Failed to create a new friend.'))
        }
    })
})

/* POST friend delete */
router.post('/friend/delete', loginCheck, (req, res, next) => {
    const friendId = req.body.friendId
    const result = deleteFriendItem(friendId)
    return result.then((val) => {
        if (val) {
            res.json(new SuccessModel(`Successfully deleted friend with ID: ${friendId}`))
        } else {
            res.json(new ErrorModel(`Failed to delete friend with ID: ${friendId}.`))
        }
    })
})

/* POST friend udpate */
router.post('/friend/update', loginCheck, (req, res, next) => {
    const id = req.body.friendId
    const friendName = req.body.newFriendName || ''
    const link = req.body.newLink || ''
    return updateFriendItem(id, friendName, link).then((val) => {
        if (val) {
            res.json(new SuccessModel(`Successfully updated friend with ID: ${id}`))
        } else {
            res.json(new ErrorModel(`Failed to update friend with ID: ${id}.`))
        }
    })
})

module.exports = router