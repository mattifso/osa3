const mongoose = require('mongoose')

const username='xxx'
const password='yyy'

// korvaa url oman tietokantasi urlilla. ethän laita salasanaa Githubiin!
const url = `mongodb://${username}:${password}@ds115653.mlab.com:15653/matti-puhelinluettelo`

mongoose.connect(url, { useNewUrlParser: true })


const Person = mongoose.model('Person', {
  name: String,
  number: String,
  id: Number
})


if (!(process.argv[2] && process.argv[3])) {
  Person
  .find({})
  .then(persons => {
    console.log('puhelinluettelo')
    persons.forEach(p => console.log(p.name + ' ' + p.number))
    mongoose.connection.close()
  })
  return
}

const person = new Person({
  id: Number((Math.random() * 1000).toFixed(0)),
  name: process.argv[2],
  number: process.argv[3]
})

console.log(`lisätään henkilö ${person.name} ${person.number} luetteloon`)
person
.save()
.then(response => {
  mongoose.connection.close()
})