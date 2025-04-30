const express = require('express')
const usersController = require('./controllers/users')
const activitiesController = require('./controllers/activities')
const cors = require('cors')

const PORT = process.env.PORT ?? 8000
require('dotenv').config()

const app = express()

// Enable CORS for all routes
app.use(cors());

// Middleware
// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})
  app.use(express.json())

app
  .get('/', (req, res) => {
    res.send('Hello New Paltz, NY!!!')
  })
  .use('/api/v1/users', usersController)
  .use('/api/v1/activities', activitiesController)

  .use('/', express.static('dist')) 

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
  
