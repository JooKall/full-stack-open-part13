const express = require('express')
require('express-async-errors')

const app = express()
const cors = require('cors')

const { PORT } = require('./utils/config')
const { connectToDatabase } = require('./utils/db')

const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
  })
}

start()