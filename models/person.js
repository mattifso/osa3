const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
  console.log('dev env')
  require('dotenv').config()
}

const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true })

const Person = mongoose.model('Person', {
  name: String,
  number: String,
  id: Number
})

module.exports = Person