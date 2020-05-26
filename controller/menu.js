const {
    mongoose,
    getNextSequenceValue
} = require('../db/mongo')

const getTopicList = (() => {
    return mongoose.models.Topic.find({}, {
        _id: 0,
        __v: 0
    })
})

const newTopicItem = async (topicName, blogId) => {
    const topicData = {
        id: await getNextSequenceValue(mongoose, 'topicId'),
        topicName,
        blogId
    }
    const newTopic = new mongoose.models.Topic(topicData)
    return newTopic.save()
}

const deleteTopicItem = (id) => {
    return mongoose.models.Topic.remove({id}).then((res) => {
        if (res.n !== 1) {
            return false
        }
        return res
    })
}

const updateTopicItem = (id, blogId, topicName) => {
    return mongoose.models.Topic.update({
        id
    }, {
        $set: {
            blogId,
            topicName
        }
    }).then((res) => {
        if (res.n !== 1) {
            return false
        }
        return res
    })
}

const getFriendList = (() => {
    return mongoose.models.Friend.find({}, {
        _id: 0,
        __v: 0,
    })
})

const newFriendItem = async (friendName, link) => {
    const friendData = {
        id: await getNextSequenceValue(mongoose, 'friendId'),
        friendName,
        link
    }
    const newFriend = new mongoose.models.Friend(friendData)
    return newFriend.save()
}

const deleteFriendItem = (id) => {
    return mongoose.models.Friend.remove({id}).then((res) => {
        if (res.n !== 1) {
            return false
        }
        return res
    })
}

const updateFriendItem = (id, friendName, link) => {
    return mongoose.models.Friend.update({
        id
    }, {
        $set: {
            friendName,
            link
        }
    }).then((res) => {
        if (res.n !== 1) {
            return false
        }
        return res
    })
}

module.exports = {
    getTopicList,
    newTopicItem,
    deleteTopicItem,
    updateTopicItem,
    getFriendList,
    newFriendItem,
    deleteFriendItem,
    updateFriendItem
}