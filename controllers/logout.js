const router = require('express').Router()
const { User, Session } = require('../models')
const { tokenExtractor } = require('../utils/middleware')

router.delete('/', tokenExtractor, async (request, response) => {
  const user = await User.findByPk(request.decodedToken.id)

  if (!user) {
    return response.status(401).json({
      error: 'invalid user',
    })
  }
  await Session.destroy({ where: { userId: user.id } })
  return response.status(200).send({ message: 'logged out!' })
})

module.exports = router
