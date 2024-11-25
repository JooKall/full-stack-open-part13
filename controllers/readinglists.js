const router = require('express').Router()
const { ReadingList, User } = require('../models')
const { tokenExtractor } = require('../utils/middleware')

router.post('/', async (request, response) => {
  const { blog_id, user_id } = request.body
  const list = await ReadingList.create({
    userId: user_id,
    blogId: blog_id,
  })
  return response.json(list)
})

router.put('/:id', tokenExtractor, async (request, response) => {
  const user = await User.findByPk(request.decodedToken.id)
  const list = await ReadingList.findByPk(request.params.id)

  if (list.userId !== user.id) {
    return response.status(403).json({ error: 'user not authorized' })
  }

  const updatedReadingList = await list.update({
    read: request.body.read,
  })
  response.json(updatedReadingList)
})

module.exports = router
