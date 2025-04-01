const express = require('express')
const e = require('express');

const PORT = 8000

const app = express();

// Middleware
app.use(express.json()) // Parse JSON request body
//controller middleware

app
  .get('/', (req, res) => {
    res.send('Hello New Paltz, NY!!!')
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
  
