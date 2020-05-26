const {genPassword} = require("../utils/cryp")

const { ADMIN_PASSWORD_ENCRYPTED, ADMIN_EMAIL } = require('../confidential')

const login = (username, password) => {
    username = escape(username)
    // Generate encrypted password
    password = escape(genPassword(password))
    // console.log(password) // Uncomment this line if you want to see the encrypted password and set above!

    if (password === ADMIN_PASSWORD_ENCRYPTED && username === ADMIN_EMAIL) {
        return Promise.resolve({
            username: ADMIN_EMAIL
        })
    }
    return Promise.resolve({})
}

module.exports = {
    login
}