const {exec, escape} = require("../db/mysql")

const perPage = 10

const getList = (author, keyword, tagId, page) => {
    author = escape(author)
    keyword = escape(keyword)
    let sql = `select id, title, exerpt, imageurl, author, createtime, tags from blogs where 1=1 `
    if (author) {
        sql += `and author='${author}' `
    }
    if (keyword) {
        sql += `and title like '%${keyword}%' `
    }
    if (tagId) {
        sql += `and (tags like '[%,${tagId},%]' or tags like '[${tagId},%]' or tags like '[%,${tagId}]' or tags like '[${tagId}]') `
    }
    sql += `order by createtime desc`
    if (page) {
        const pageNum = parseInt(page)
        if (!isNaN(pageNum) && pageNum > 0) {
            const low = (pageNum - 1) * perPage
            sql += ` limit ${low}, ${perPage}`
        } else {
            return Promise.resolve([])
        }
    }
    sql += `;`
    
    // 现在返回的是promise
    return exec(sql)
}

const getPageCount = (author, keyword, tagId) => {
    author = escape(author)
    keyword = escape(keyword)
    let sql = `select count(*) from blogs where 1=1 `
    if (author) {
        sql += `and author='${author}' `
    }
    if (keyword) {
        sql += `and title like '%${keyword}%' `
    }
    if (tagId) {
        sql += `and (tags like '[%,${tagId},%]' or tags like '[${tagId},%]' or tags like '[%,${tagId}]' or tags like '[${tagId}]') `
    }
    sql += `;`

    // 这也是promise
    return exec(sql).then(result => {
        return {
            pageCount: Math.ceil(result[0]['count(*)'] * 1.0 / perPage)
        }
    })
}

const getDetail = (id) => {
    id = escape(id)
    const sql = `select * from blogs where id='${id}' `
    // 返回的仍然是一个 promise
    return exec(sql).then(rows => {
        return rows[0]
    })
}

const newBlog = ((blogData = {}) => {
    // blogData 是一个博客对象，包含 title content author属性
    const title = escape(blogData.title)
    const author = escape(blogData.author)
    const createTime = Date.now()

    const sql = `
        insert into blogs (title, content, createTime, author, exerpt, tags, imageurl)
        value(
            '${title}',
            '',
            '${createTime}',
            '${author}',
            '',
            '[]',
            ''
        );
    `
    return exec(sql).then(insertData => {
        return {
            id: insertData.insertId
        }
    })
})

const updateBlog = (id, blogData = {}) => {
    // id 就是要更新博客的id
    // blogData 是一个博客对象，包含 title content 属性
    const title = escape(blogData.title)
    const content = escape(blogData.content)
    const exerpt = escape(blogData.exerpt)
    const imageurl = escape(blogData.imageUrl)
    const tags = escape(JSON.stringify(blogData.tags))
    const createtime = blogData.createtime

    const sql = `
        update blogs set title='${title}', content='${content}', exerpt='${exerpt}', imageurl='${imageurl}', tags='${tags}', createtime='${createtime}' where id=${id};
    `

    return exec(sql).then(updateData => {
        if (updateData.affectedRows > 0) {
            return true;
        }
        return false;
    })
}

const delBlog = (id, author) => {
    id = escape(id)
    author = escape(author)
    // id 就是要删除博客的id
    const sql = `delete from blogs where id='${id}' and author='${author}';`
    return exec(sql).then(delData => {
        if (delData.affectedRows > 0) {
            return true
        }
        return false
    })
}

module.exports = {
    getList,
    getPageCount,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}
