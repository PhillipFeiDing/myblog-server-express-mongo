const {exec, escape} = require("../db/mysql")

const getTagList = () => {
    const sql = `select * from tags order by id asc;`
    return exec(sql)
}

const newTag = (tagName) => {
    tagName = escape(tagName)
    const selectSql = `select id from tags where tagName='${tagName}';`
    return exec(selectSql).then(selectData => {
        if (selectData.length !== 0) {
            return null
        }
        const insertSql = `insert into tags (tagName) values('${tagName}');`
        return exec(insertSql).then(newData => {
            return {
                id: newData.insertId
            }
        })
    })
}

const delTag = (tagId) => {
    tagName = escape(tagId)
    const sql = `delete from tags where id='${tagId}';`
    return exec(sql).then(delData => {
        if (delData.affectedRows > 0) {
            return true
        }
        return false
    })
}

module.exports = {
    newTag,
    getTagList,
    delTag
}