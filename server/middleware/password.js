const bcrypt = require('bcryptjs')

function genPassword(password) {
    const salt = bcrypt.genSaltSync(10)
    const created = bcrypt.hashSync(password, salt)
    return created;
}

function validPassword(password_db, password_input) {
    const passwordResult = bcrypt.compareSync(password_input, password_db)
    return passwordResult
}

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;