const { Sequelize } = require('sequelize')

// parameter dibawah ini artinya seperti berikut('namadb', 'username', 'pass', {option})
const sequelize = new Sequelize('absensi', 'root', '', {
  dialect: 'mysql',
  host: 'localhost'
})

module.exports = sequelize