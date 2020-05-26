const express = require('express')
const router = express.Router()

const {
    newTag,
    getTagList,
    deleteTag,
    updateTag
} = require('../controller/tag')

const {SuccessModel, ErrorModel} = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

/* GET taglist */
router.get('/list', (req, res, next) => {
    const result = getTagList()
    return result.then(listData => {
        res.json(new SuccessModel(listData))
    })
})

/* POST new */
router.post('/new', loginCheck, (req, res, next) => {
    const tagName = req.body.tagName
    const result = newTag(tagName)
    return result.then((val) => {
        if (val) {
            res.json(new SuccessModel(`Successfully created a tag, returned ID: ${val.id}`))
        } else {
            res.json(new ErrorModel('Failed to create a new tag.'))
        }
    })
})

/* POST delete */
router.post('/delete', loginCheck, (req, res, next) => {
    const tagId = req.body.tagId
    const result = deleteTag(tagId)
    return result.then(val => {
        if (val) {
            res.json(new SuccessModel("Successfully deleted tag with ID " + tagId + "."))
        } else {
            res.json(new ErrorModel("Failed to delete tag with ID " + tagId + "."))
        }
    })
})

/* POST update */
router.post('/update', loginCheck, (req, res, next) => {
    const tagId = req.body.tagId
    const newTagName = req.body.newTagName
    const result = updateTag(tagId, newTagName)
    return result.then(val => {
        if (val) {
            res.json(new SuccessModel(`Successfully updated tag with ID ${tagId}.`))
        } else {
            res.json(new ErrorModel(`Failed to update tag with ID ${tagId}.`))
        }
    })
})

module.exports = router