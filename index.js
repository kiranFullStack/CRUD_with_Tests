const express = require('express')
const mongoose = require('mongoose')

const app = express()
app.use(express.json())

const port = 3000

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/your-database-name', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB')
    // Start the server once the database connection is established
    app.listen(3000, () => {
      console.log('Server is running on http://localhost:3000')
    })
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error)
  })

// Define data schema
const dataSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  field: { type: String, required: true },
})

// Create data model
const Data = mongoose.model('Data', dataSchema)

// GET endpoint to fetch individual values based on a parameter
app.get('/api/data/:id', (req, res) => {
  const id = req.params.id

  Data.findOne({ id })
    .then((result) => {
      if (!result) {
        res.sendStatus(404)
        return
      }
      res.json(result)
    })
    .catch((error) => {
      console.error('Error retrieving data from MongoDB:', error)
      res.sendStatus(500)
    })
})

// GET endpoint to fetch data using query parameters
app.get('/api/data', (req, res) => {
  const { queryParam } = req.query

  Data.find({ field: queryParam })
    .then((results) => {
      res.json(results)
    })
    .catch((error) => {
      console.error('Error retrieving data from MongoDB:', error)
      res.sendStatus(500)
    })
})

// POST endpoint to create new data
app.post('/api/data', (req, res) => {
  const newData = req.body

  Data.create(newData)
    .then(() => {
      res.sendStatus(201)
    })
    .catch((error) => {
      console.error('Error inserting data into MongoDB:', error)
      res.sendStatus(500)
    })
})

// PUT endpoint to update existing data
app.put('/api/data/:id', (req, res) => {
  const id = req.params.id
  const updatedData = req.body

  Data.updateOne({ id }, updatedData)
    .then(() => {
      res.sendStatus(200)
    })
    .catch((error) => {
      console.error('Error updating data in MongoDB:', error)
      res.sendStatus(500)
    })
})

// DELETE endpoint to delete data
app.delete('/api/data/:id', (req, res) => {
  const id = req.params.id

  Data.deleteOne({ id })
    .then(() => {
      res.sendStatus(200)
    })
    .catch((error) => {
      console.error('Error deleting data from MongoDB:', error)
      res.sendStatus(500)
    })
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
