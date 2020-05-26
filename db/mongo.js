const mongoose = require('mongoose')
const {
    getBlogModel,
    getTagModel,
    getTopicModel,
    getFriendModel,
    getNextSequenceValue,
} = require('../model/dataModel')
const {MONGO_CONF} = require('../conf/db')

mongoose.connect(MONGO_CONF.uri.replace('<password>', MONGO_CONF.password), {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.on('connected', async () => {
    console.log('MongoDB Atlas: Mongoose connection has been established.')

    await getBlogModel(mongoose)
    await getTagModel(mongoose)
    await getTopicModel(mongoose)
    await getFriendModel(mongoose)

    console.log('MongoDB Atlas: Mongoose data models have been initilized.')
})

module.exports = {
    mongoose,
    getNextSequenceValue
}