// route supaya kita bisa punya endpoint, biasanya kalo di ruang lingkup backend sering denger namanya endpoint
// endpoint itu kurang lebih muncul awalnya dari si route yang dibikin dari bagian kodingannya
const express = require('express')
const router = express.Router()
const UsersModel = require('../models/users')
const bcrypt = require('bcrypt')
const passwordCheck = require('../utils/passwordCheck')
// routing endpoint users utama
// penulisan req, res itu awalanya req dlu karena dari diawali request frontend ke backend/server, kemudian direspon dari backend/server ke frontend
// jadi yang penulisannya req, res
router.get('/', async (req, res) => {
  const users = await UsersModel.findAll()
  res.status(200).json({
    data: users,
    metadata: "test user endpoint"
  })
})

router.post('/', async (req, res) => {
  // dari frontend request nip, nama, password ->>>>>>>>>>> BE nangkep pakai cara dibawah ini
  // const nip = req.body.nip
  // const nama = req.body.nama
  // const password = req.body.password
  // cara diatas bisa dipersingkat dengan konsep destructuring javascript
  const { nip, nama, password } = req.body

  const encryptedPassword = await bcrypt.hash(password, 10)

  const users = await UsersModel.create({
    nip, nama, password: encryptedPassword
  })
  res.status(200).json({
    registered: users,
    metadata: "test post user endpoint"
  })
})

router.put('/', async (req, res) => {
  const { nip, nama, password, passwordBaru } = req.body

  const check = await passwordCheck(nip, password)

  const encryptedPassword = await bcrypt.hash(passwordBaru, 10)
  // password yang muncul di db === pasword dari inputan
  if (check.compare === true) {
    const users = await UsersModel.update({
      nama, password: encryptedPassword
    }, { where: { nip: nip } })

    res.status(200).json({
      users: { updated: users[0] },
      metadata: "user updated! 😋"
    })
  } else {
    res.status(400).json({
      error: "data invalid"
    })
  }
})

router.post('/login', async (req, res) => {
  const { nip, password } = req.body
  // try and catch ini ketika memvalidasi data, gimana caranya supaya server apinya jangan mati (crash) ketika terjadi error
  // karena kalau tidak di try and catch, kalau masuk ke try artinya mencoba mencocokan data terlebih dahulu, ketika berfungsi maka keluar pesan "login success", kalau tidak berfungsi maka data yg error tersebut ditangkap/dihandling, supaya server tidak crash.
  try {
    const check = await passwordCheck(nip, password)
    if (check.compare === true) {
      res.status(200).json({
        users: check.userData,
        metadata: "login success"
      })
    }
  } catch (e) {
    res.status(400).json({
      error: "data invalid"
    })
  }
})

router.delete('/:id', async (req, res) => {
  const userId = req.params.id
  try {
    // cari pengguna berdasarkan ID
    const user = await UsersModel.findByPk(userId)

    // jika pengguna ditemukan
    if (user) {
      // hapus pengguna dari database
      await user.destroy();
      res.status(200).json({
        message: "User deleted successfully"
      });
    } else {
      // Jika pengguna tidak ditemukan
      res.status(404).json({
        error: "User not found"
      })
    }
  } catch (error) {
    // Tangani kesalahan server
    console.error("Error deleting user: ", error);
    res.status(500).json({
      error: "Internal server error"
    })
  }
});

module.exports = router