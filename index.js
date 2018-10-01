const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'))
app.use(express.static('build'))

morgan.token('json', function getJson(req) {
    return JSON.stringify(req.body)
})

const formatPerson = (person) => {
    return {
        name: person.name,
        number: person.number,
        id: person._id
    }
}

app.get('/api/persons/', (req, res) => {
    Person.find({}, { ___v: 0 })
        .then(persons => {
            res.json(persons.map(formatPerson))
        })
        .catch(error => {
            console.log(error)
        })
})

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id)
        .then(found => {
            if (!found) {
                res.status(404).end()
                return
            }
            res.json(found).map(formatPerson).end()
        })
        .catch(error => {
            res.status(400).send({ error: 'malformatted id' })
        })
})

app.delete('/api/persons/:id', (req, res) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => {
            res.status(400).send({ error: 'malformatted id' })
        })
})

const generateId = () => (Number((Math.random() * 1000).toFixed(0)))

app.post('/api/persons', (req, res) => {
    if (!req.body.name) {
        return res.status(400).json({ error: 'name missing' })
    }
    if (!req.body.number) {
        return res.status(400).json({ error: 'number missing' })
    }

    Person.find({ name: req.body.name })
        .then(persons => {
            if (persons.length > 0) {
                return res.status(409).json({ error: 'name must be unique' })
            }

            const newPerson = new Person({ name: req.body.name, number: req.body.number })
            newPerson.save()
                .then(formatPerson)
                .then(savedPerson => {
                    res.status(201).json(savedPerson).end()
                })
                .catch(error => {
                    console.log(error)
                    res.status(500).end()
                })
        })
        .catch(error => {
            console.log(error)
        })
})

app.put('/api/persons/:id', (req, res) => {
    if ((!req.body.name || !req.body.number)) {
        return res.status(400).end()
    }
    Person.findById(req.params.id)
        .then(found => {
            if (!found) {
                res.status(404).end()
                return
            }
            const updatedPerson = { name: req.body.name, number: req.body.number }
            Person.findByIdAndUpdate(req.params.id, updatedPerson, { new: true })
                .then(formatPerson)
                .then(savedPerson => {
                    res.json(savedPerson)
                })
                .catch(error => {
                    console.log(error)
                    res.status(400).send({ error: 'malformatted id' })
                })
        })
        .catch(error => {
            res.status(400).end()
        })
})

app.get('/info', (req, res) => {
    Person.find({}, { ___v: 0 })
        .then(persons => {
            const msg = `puhelinluettelossa on ${persons.length} henkilön tiedot <p> ${Date()}`
            res.send(msg)
        })
        .catch(error => {
            console.log(error)
            res.status(500).end()
        })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
