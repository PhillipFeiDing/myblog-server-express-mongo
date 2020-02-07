const {exec, escape} = require("../db/mysql")

const getMenuList = (() => {
    const sql = `select * from menu order by id asc;`
    return exec(sql)
})

const newMenuItem = ((itemname, link) => {
    itemname = escape(itemname)
    link = escape(link)
    const sql = `insert into menu (itemname, link) values ('${itemname}', '${link}');`
    return exec(sql).then(newData => {
        return {
            id: newData.insertId
        }
    })
})

const delMenuItem = ((id) => {
    id = escape(id)
    const sql = `delete from menu where id='${id}';`
    return exec(sql).then(delData => {
        if (delData.affectedRows > 0) {
            return true
        }
        return false
    })
})

const updateMenuItem = ((id, newItemName, newLink) => {
    newItemName = escape(newItemName)
    newLink = escape(newLink)
    const sql = `update menu set itemname='${newItemName}', link='${newLink}' where id='${id}';`
    return exec(sql).then(updateData => {
        if (updateData.affectedRows > 0) {
            return true;
        }
        return false;
    })
})

module.exports = {
    getMenuList,
    newMenuItem,
    delMenuItem,
    updateMenuItem
}