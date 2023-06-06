const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(
  'mongodb+srv://admin:abc123456@cluster0.hzuhauw.mongodb.net/test?retryWrites=true&w=majority'
)

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
})
const PracticeSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  userid: {
    type: String,
    required: true,
  },
  description: String,
  duration: Number,
  date: Date,
})
// const LogSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//   },
//   count: Number,
//   log: [
//     {
//       description: String,
//       duration: Number,
//       date: Date,
//     },
//   ],
// })

let User = mongoose.model('User', UserSchema)
let Practice = mongoose.model('Practice', PracticeSchema)
// let Log = mongoose.model('Log', LogSchema)

const createAndSaveUser = (user, done) => {
  var janeFonda = User.create(user, function (err, data) {
    if (err) return console.error(err)
    done(null, data)
  })
}

const findUser = (done) => {
  User.find({}, function (err, data) {
    if (err) return console.error(err)
    done(null, data)
  })
}

const findUserById = (_id, done) => {
  User.findById(_id, function (err, data) {
    if (err) return console.error(err)
    done(null, data)
  })
}

const createAndSavePractice = (practice, done) => {
  var janeFonda = Practice.create(practice, function (err, data) {
    if (err) return console.error(err)
    done(null, data)
  })
}

const findLogs = (_id, { from, to, limit }, done) => {
  Practice.find({
    userid: _id,
    date: { $gte: from || new Date('1900-01-01'), $lt: to || new Date() },
  })
    .limit(Number(limit) || 9999)
    .exec(function (err, data) {
      if (err) return console.error(err)
      done(null, data)
    })
}

exports.User = User
exports.Practice = Practice
// exports.Log = Log
exports.createAndSaveUser = createAndSaveUser
exports.findUser = findUser
exports.findUserById = findUserById
exports.createAndSavePractice = createAndSavePractice
exports.findLogs = findLogs
