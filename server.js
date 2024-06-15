// ini jangan dipikir
const express = require('express')
const cors = require('cors')
const port = 3200

const sequelize = require('./db.config')
sequelize.sync().then(() => console.log('database ready!'))

// pikir
const userEndpoint = require('./routes/users')
const absensiEndpoint = require('./routes/absensi')

// ini jangan dipikir
const app = express() //tujuan dari ekspres ini supaya mudah bikin endpoint api
app.use(cors())
app.use(express.json())

// pikir
app.use('/users', userEndpoint)
app.use('/absensi', absensiEndpoint)

// ini jangan dipikir
app.listen(port, () => console.log(`running server on port ${port}`))