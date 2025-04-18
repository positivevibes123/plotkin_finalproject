const express = require('express')
const cors = require('cors')
const usersController = require('./controllers/users')
const activitiesController = require('./controllers/activities')
require('dotenv').config()

const PORT = process.env.PORT ?? 8000

const app = express()

// Middleware
app.use(express.json()) // Parse JSON request body
//controller middleware

// enabling CORS for any unknown origin(https://xyz.example.com)
app.use(cors());

app
  .get('/', (req, res) => {
    res.send('Hello New Paltz, NY!!!')
  })
  .use('/api/v1/users', usersController)
  .use('/api/v1/activities', activitiesController)

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

//error handling middleware
app.use((err, req, res, next) => {
    console.error(err)
    const status = err.status || 500
  
    const error = {
      status,
      message: err.message || 'Internal Server Error',
    }
    res.status(status).send(error)
  })

  // Listen on port 8000, IP defaults to


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`)
});
  
