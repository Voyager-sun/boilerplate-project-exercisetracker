const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const { User, Practice, Log } = require('./server.js')

app.use(bodyParser.urlencoded({ extended: 'false' }))
app.use(bodyParser.json())

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})

const createAndSaveUser = require('./server').createAndSaveUser
const findUser = require('./server').findUser

app.post('/api/users', function (req, res) {
  createAndSaveUser(req.body, function (err, data) {
    res.json({
      username: data.username,
      _id: data._id,
    })
  })
})

app.get('/api/users', function (req, res) {
  findUser(function (err, data) {
    res.json(
      data.map((item) => {
        return { username: item.username, _id: item._id }
      })
    )
  })
})

const findLogs = require('./server').findLogs
// /api/users/:_id/logs?[from][&to][&limit]
app.get('/api/users/:_id/logs', (req, res) => {
  if (!req.params._id) return
  findLogs(req.params._id, req.query, function (err, data) {
    if (err) return

    const logs = data
      ? data.map((item) => {
          return {
            description: item.description,
            duration: item.duration,
            date: new Date(item.date).toDateString(),
          }
        })
      : []
    res.json({
      username: data[0] ? data[0].username : '',
      count: data.length,
      log: logs,
    })
  })
})

/**
 * {
  "_id": "647ee12750c71a07e5509fbd",
  "username": "1111",
  "date": "Tue Jun 06 2023",
  "duration": 232,
  "description": "1123123213"
}
 */
const findUserById = require('./server').findUserById
const createAndSavePractice = require('./server').createAndSavePractice
app.post('/api/users/:_id/exercises', (req, res) => {
  findUserById(req.params._id, function (err, user) {
    if (err) return
    createAndSavePractice(
      {
        userid: user._id,
        username: user.username,
        description: req.body.description,
        duration: req.body.duration,
        date: req.body.date
          ? new Date(req.body.date)
          : new Date().toDateString(),
      },
      function (err, data) {
        res.json({
          _id: data.userid,
          username: data.username,
        })
      }
    )
  })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
