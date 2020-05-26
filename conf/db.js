const env = process.env.NODE_ENV // 环境变量
const { MONGO_ATLAS_PASS } = require('../confidential')

// 配置
let MONGO_CONF = {}
let REDIS_CONF = {}

if (env === "development") {
    // redis
    REDIS_CONF = {
        port: 6379,
        host: "127.0.0.1"
    }

    // mongo
    MONGO_CONF = {
        uri: 'mongodb+srv://PhillipFeiDing:<password>@testcluster1-fzzbk.mongodb.net/myblog?retryWrites=true&w=majority',
        password: MONGO_ATLAS_PASS
    }
}

if (env === 'production') {
    // redis
    REDIS_CONF = {
        port: 6379,
        host: "127.0.0.1"
    }

    // mongo
    MONGO_CONF = {
        uri: 'mongodb+srv://PhillipFeiDing:<password>@testcluster1-fzzbk.mongodb.net/myblog?retryWrites=true&w=majority',
        password: MONGO_ATLAS_PASS
    }
}

module.exports = {
    REDIS_CONF,
    MONGO_CONF
}
