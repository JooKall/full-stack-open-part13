const logger = require('./logger')
const jwt = require('jsonwebtoken')
const { SECRET } = require('./config.js')
const { Session, User } = require('../models')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'SequelizeDatabaseError') {
    return response.status(400).send({ error: error.message })
  } else if (error.name === 'SequelizeValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'TypeError') {
    return response.status(400).json({ error: error.message })
  }

  response.status(500).json({ error: 'Internal server error' })

  next(error)
}

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const token = authorization.substring(7)

      const decodedToken = jwt.verify(token, SECRET)

      const user = await User.findByPk(decodedToken.id)
      if (user.disabled) {
        await Session.destroy({
          where: { userId: user.id },
        })
        return res.status(401).json({ error: 'user disabled, session removed' })
      }

      const validSession = await Session.findOne({
        where: { token: token },
      })

      if (!validSession) {
        return res.status(401).json({ error: 'session invalid' })
      }

      req.decodedToken = decodedToken
    } catch (error) {
      console.log(error)
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }

  next()
}

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
}
