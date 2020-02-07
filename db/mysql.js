const mysql = require("mysql")
const {MYSQL_CONF} = require("../conf/db")

// 创建连接对象
const con = mysql.createConnection(MYSQL_CONF)

// 开始连接
con.connect()

// 统一执行 sql 的函数
function exec(sql) {
    const promise = new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            if (err) {
                console.error(err)
                reject(err)
                return
            }
            resolve(result)
        })
    })
    return promise
}

// 改造一下 mysql 的 escape函数，
function escape(str) {
    const temp = mysql.escape(str)
    return temp.substring(1, temp.length - 1)
}

// 待定，无需关闭

module.exports = {
    exec,
    escape
}