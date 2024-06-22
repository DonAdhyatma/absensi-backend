const express = require('express');
const router = express.Router();
const UsersModel = require('../models/users');
const bcrypt = require('bcrypt');
const passwordCheck = require('../utils/passwordCheck');

// Routing endpoint users utama
router.get('/', async (req, res) => {
  try {
    const users = await UsersModel.findAll();
    res.status(200).json({
      data: users,
      metadata: "test user endpoint"
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error"
    });
  }
});

router.post('/', async (req, res) => {
  const { nip, nama, password } = req.body;

  try {
    const encryptedPassword = await bcrypt.hash(password, 10);

    const users = await UsersModel.create({
      nip, nama, password: encryptedPassword
    });

    res.status(201).json({
      registered: users,
      metadata: "test post user endpoint"
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error"
    });
  }
});

router.put('/', async (req, res) => {
  const { nip, nama, password, passwordBaru } = req.body;

  try {
    const check = await passwordCheck(nip, password);

    if (check.compare === true) {
      const encryptedPassword = await bcrypt.hash(passwordBaru, 10);
      // password yang muncul di db === password dari inputan
      const users = await UsersModel.update({
        nama, password: encryptedPassword
      }, { where: { nip: nip } });

      res.status(200).json({
        users: { updated: users[0] },
        metadata: "user updated! 😋"
      });
    } else {
      res.status(400).json({
        error: "Invalid current password"
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Internal server error"
    });
  }
});

router.post('/login', async (req, res) => {
  const { nip, password } = req.body;

  try {
    const check = await passwordCheck(nip, password);
    if (check.compare === true) {
      res.status(200).json({
        users: check.userData,
        metadata: "login success"
      });
    } else {
      res.status(401).json({
        error: "Invalid NIP or password"
      });
    }
  } catch (error) {
    res.status(500).json({
      error: "Internal server error"
    });
  }
});

router.delete('/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await UsersModel.findByPk(userId);
    // jika pengguna ditemukan
    if (user) {
      // hapus pengguna dari database
      await user.destroy();
      res.status(200).json({
        message: "User deleted successfully"
      });
    } else {
      // jika pengguna tidak ditemukan
      res.status(404).json({
        error: "User not found"
      });
    }
  } catch (error) {
    // Tangani kesalahan server
    console.error("Error deleting user: ", error);
    res.status(500).json({
      error: "Internal server error"
    });
  }
});

module.exports = router;
