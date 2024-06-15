const { Model, DataTypes } = require('sequelize')
const sequelize = require('../db.config')

class Absensi extends Model { }

Absensi.init({
  users_nip: {
    type: DataTypes.INTEGER
  },
  status: {
    type: DataTypes.ENUM('in', 'out')
  }
}, {
  sequelize,
  modelName: 'Absensi'
})
// model tabel database otomatis penamaannya diberi huruf s di huruf paling akhir
// karena asumsinnya model data itu tidak tunggal jumlahnya jamak, makanya nama menjadi absensis
module.exports = Absensi