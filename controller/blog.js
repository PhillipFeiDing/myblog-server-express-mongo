const {
    mongoose,
    getNextSequenceValue
} = require('../db/mongo')

const getList = () => {
    return mongoose.models.Blog.find({

    }, {
        _id: 0,
        __v: 0,
        content: 0
    }).sort({
        time: -1
    })
}

const getDetail = (id) => {
    id = escape(id)
    return mongoose.models.Blog.findOne({
        id
    }, {
        _id: 0,
        __v: 0,
    }).then((res) => {
        if (!res) {
            throw new Error(`No such blog with ID ${id}.`)
        }
        return res
    })
}

const newBlog = async () => {
    const id = await getNextSequenceValue(mongoose, 'blogId')
    const blogData = {
        id,
        title: 'Blog ' + id,
        time: Date.now()
    }
    const newBlog = new mongoose.models.Blog(blogData)
    return newBlog.save()
}

const updateBlog = (blogData = {}) => {
    const id = blogData.id
    return mongoose.models.Blog.update({
        id
    }, {
        $set: {
            content: blogData.content,
            time: blogData.time,
            exerpt: blogData.exerpt,
            tagList: blogData.tagList,
            title: blogData.title,
            imageURL: blogData.imageURL,
            channel: blogData.channel
        }
    }).then(res => {
        if (res.n !== 1) {
            return false
        }
        return res
    })
}

const deleteBlog = (blodId) => {
    const id = blodId
    return mongoose.models.Blog.remove({id}).then((res) => {
        if (res.n !== 1) {
            return false
        }
        return res
    })
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog
}
