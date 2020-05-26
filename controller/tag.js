const {
    mongoose,
    getNextSequenceValue
} = require('../db/mongo')

const getTagList = () => {
    return mongoose.models.Tag.find({}, {
        _id: 0,
        __v: 0
    })
}

const newTag = async (tagName) => {
    const tagData = {
        id: await getNextSequenceValue(mongoose, 'tagId'),
        tagName
    }
    const newTag = new mongoose.models.Tag(tagData)
    return newTag.save()
}

const deleteTag = (tagId) => {
    const id = tagId
    return mongoose.models.Tag.remove({id}).then((res) => {
        if (res.n !== 1) {
            return false
        }
        return res
    })
}

const updateTag = (tagId, newTagName) => {
    const id = tagId
    return mongoose.models.Tag.update({
        id
    }, {
        $set: {
            tagName: newTagName
        }
    }).then(res => {
        if (res.n !== 1) {
            return false
        }
        return res
    })
}

module.exports = {
    newTag,
    getTagList,
    deleteTag,
    updateTag
}