const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'))

morgan.token('json', function getJson (req) {
    return JSON.stringify(req.body)
})


let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Martti Tienari",
        "number": "040-123456",
        "id": 2
    },
    {
        "name": "Arto Järvinen",
        "number": "040-123456",
        "id": 3
    },
    {
        "name": "Lea Kutvonen",
        "number": "040-123456",
        "id": 4
    }
]

app.get('/api/persons/', (req, res) => {
    res.json(persons).end()
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person).end()
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => (person.id !== id))
    res.status(204).end()
})

const generateId = () => (Number((Math.random() * 1000).toFixed(0)))

app.post('/api/persons', (req, res) => {
    const newPerson = {name: req.body.name, number: req.body.number}
    if (!newPerson.name) {
        return res.status(400).json({ error: 'name missing' })
    }
    if (!newPerson.number) {
        return res.status(400).json({ error: 'number missing' })
    }
    if (persons.find(p => (p.name === newPerson.name ))) {
        return res.status(409).json({ error: 'name must be unique' })
    }

    newPerson.id = generateId()
    persons = persons.concat(newPerson)
    res.status(201).json(newPerson).end()
})

app.put('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    
    let person = persons.find(person => person.id === id)
    if (!person) {
        return res.status(404).end()
    }
    if ((!req.body.name || !req.body.number)) {
        return res.status(400).end()
    }
    person.name = req.body.name;
    person.number = req.body.number
    res.status(200).end()
})

app.get('/info', (req, res) => {
    const msg = `puhelinluettelossa on ${persons.length} henkilön tiedot <p> ${Date()}`
    res.send(msg)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
