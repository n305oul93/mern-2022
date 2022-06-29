const express = require('express')
const dotenv = require('dotenv').config()
const colors = require('colors')
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const PORT = process.env.PORT || 51914

connectDB()
app = express()

/************* Middleware ****************/
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

/************* Routes ********************/
app.use('/api/goals', require('./routes/goalRoutes'))
app.use('/api/users', require('./routes/userRoutes'))

// error handler middleware
app.use(errorHandler)

app.listen(PORT, () => console.log(`Express Server running on port ${PORT}`))
