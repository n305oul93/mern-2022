const express = require('express')
const dotenv = require('dotenv').config()
const { errorHandler } = require('./middleware/errorMiddleware')
const PORT = process.env.PORT || 51914

app = express()

/************* Middleware ****************/
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

/************* Routes ********************/
app.use('/api/goals', require('./routes/goalRoutes'))

// error handler middleware
app.use(errorHandler)

app.listen(PORT, () => console.log(`Express Server running on port ${PORT}`))