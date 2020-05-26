// This function is used to support auto-incrementing IDs in MongoDB.
async function getNextSequenceValue(mongoose, sequenceName) {
    const filter = {id: sequenceName}
    const update = {$inc:{sequence_value:1}}
    const options = {new: true, upsert: true, rawResult: true}
    try {
        const res = await mongoose.connection.db.collection('counter').findOneAndUpdate(filter, update, options)
        return res.value.sequence_value
    } catch (error) {
        console.log('Counter Error. ' + error)
        return -1
    }
}

async function getBlogModel(mongoose) {
    const Schema = mongoose.Schema
    const BlogSchema = new Schema({
        id: {
            type: Number,
            default: -1
        },
        content: {
            type: String,
            default: ''
        },
        time: {
            type: Number,
            default: Date.now()
        },
        exerpt: {
            type: String,
            default: ''
        },
        tagList: {
            type: [Number],
            default: []
        },
        title: {
            type: String,
            default: ''
        },
        imageURL: {
            type: String,
            default: ''
        }
    })
    mongoose.model('Blog', BlogSchema)
}

async function getTagModel(mongoose) {
    const Schema = mongoose.Schema
    const TagSchema = new Schema({
        id: {
            type: Number,
            default: -1
        },
        tagName: {
            type: String,
            default: ''
        }
    })
    mongoose.model('Tag', TagSchema)
}

async function getTopicModel(mongoose) {
    const Schema = mongoose.Schema
    const TopicSchema = new Schema({
        id: {
            type: Number,
            default: -1
        },
        blogId: {
            type: Number,
            default: -1
        },
        topicName: {
            type: String,
            default: ''
        }
    })
    mongoose.model('Topic', TopicSchema)
}

async function getFriendModel(mongoose) {
    const Schema = mongoose.Schema
    const FriendSchema = new Schema({
        id: {
            type: Number,
            default: -1
        },
        friendName: {
            type: String,
            default: ''
        },
        link: {
            type: String,
            default: ''
        }
    })
    mongoose.model('Friend', FriendSchema)
}

module.exports = {
    getBlogModel,
    getTagModel,
    getTopicModel,
    getFriendModel,
    getNextSequenceValue
}