const bcrypt = require('bcrypt')
const UsersModel = require('../models/users')

const passwordCheck = async (nip, password) => {
  const userData = await UsersModel.findOne({ where: { nip: nip } })

  if (!userData) {

    return { compare: false, userData: null }
  }

  const compare = await bcrypt.compare(password, userData.password)
  return { compare, userData }
}

module.exports = passwordCheck