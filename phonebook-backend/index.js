// eslint-disable-next-line no-unused-vars
const { response, json } = require('express')
const express = require('express')
const app = express()

require('dotenv').config()
// Person variable will be assigned to the same object that the module defines
const Person = require('./models/phonebook')

// Add morgan a HTTP request logger middleware for node.js using tiny configuration
var morgan = require('morgan')

// to use the production build from create react app inside your backend
app.use(express.static('build'))

// In order to access the data easily, we need the help of the express json-parser for the post method to access the request body
// Without the json-parser i.e. json(), the body property  of request object sent through post request would be undefined.
app.use(express.json())

// Add use method for morgan after you've got the request data use of express.json to log request using tiny configuration to console
// tiny - :method :url :status :res[content-length] - :response-time ms
// app.use(morgan('tiny'))

// Configure morgan so that it also shows the data sent in HTTP POST requests using morgan token
morgan.token('postData', (request) => {
  if(request.method === 'POST')
  {
    return JSON.stringify(request.body)
  }
  else {
    return ' '
  }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))

// cors middleware to use and allow for requests from all origins for connecting part2 phonebook frontend & part3 phonebook backend
const cors = require('cors')
app.use(cors())

// get method to display all contacts in phonebook of mongodb using find method of Person model
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// get method to display time that the request was received and how many entries are in the phonebook
app.get('/info', (request, response) => {
  const timestamp = new Date()

  Person.find({}).then(persons => {
    // console.log(persons)
    response.send(
      `<p>Phonebook has info for ${persons.length} people</p></ br>
			<p>${timestamp}</p>`
    )
  })
})

// get method to find a contact in the phonebook by using the route parameter - :id in request
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if(Person) {
        response.json(person)
      }
      else {
        // no matching object is found in the database, the value of Person will be null then 404 not found
        response.status(404).end()
      }

    })
  // Given malformed id like /api/notes/someInvalidId as an argument, the findById method will throw an error causing the returned promise to be rejected
  // this causes callback function call to catch block
    .catch(error => next(error))
})

// add delete method & test it out using the postman desktop app or REST client vscode extension
// delete method to remove a note from Phonebook list on mongodb using findByIdAndRemove method of Person model
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    // eslint-disable-next-line no-unused-vars
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// // Returns a random integer between min (inclusive) and max (inclusive) for id number, great explanation in comments of stackoverflow link
// // resource:https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
// function getRandomInt(min, max) {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// post method to add a note to notes list
app.post('/api/persons', (request, response, next) => {
  // the body property  of request object contains data sent through post request
  const body = request.body
  console.log(body.name)

  // verify if the name is a duplicate or not
  // https://stackoverflow.com/questions/35833176/node-js-check-if-field-exists-in-mongo-db#:~:text=router.post%20%28%27%2Flogin%27%2C%20function%20%28request%2C%20response%29%20%7B%20User.find%20%28%7B,this%20field%20already%20exists%20in%20my%20mongo%20database.
  Person.findOne({ name: body.name },function(error, person) {
    if(person) {
      return response.status(400).json({ error: 'name must be unique' })
    }
    else {
      const person = new Person({
        name: body.name,
        number: body.number
      })

      person.save().then(savedContact => {
        response.json(savedContact)
      })
        .catch(error => next(error))
    }
  })
})

// put method to update a contact in phonebook on mongodb using the findByIdAndUpdate method of Person model
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  // // don't use the javascript object note in findbyidandupdate just send the props name, number directly refer syntax documentation
  // const person = {
  // 	name: body.name,
  // 	number: body.number
  // }
  // console.log(person)

  Person.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      console.log(updatedPerson)
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

// add a middleware function that catches requests made to the non-existent routes
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if(error.name === 'CastError') {
    // when dealing with Promises i.e. like findById it's a good idea to print the object that caused the exception to the console in the error handler
    console.log(error)
    // error handler response
    return response.status(400).send({ error: 'Malformatted id' })
  }
  // error handler checks if the error is a ValidationError exception from the note schema
  else if(error.name === 'ValidationError') {
    return response.status(400).json({ error:error.message })
  }

  // In all other error situations, the middleware passes the error forward to the default Express error handler
  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

// define a port to output the response received from the server
// eslint-disable-next-line no-undef
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})