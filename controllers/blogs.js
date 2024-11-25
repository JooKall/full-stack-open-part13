const router = require('express').Router()
const { Op } = require('sequelize')

const { Blog, User } = require('../models')
const { tokenExtractor } = require('../utils/middleware')


router.get('/', async (request, response) => {
  let where = {}

  if (request.query.search) {
    where = {
      [Op.or]: [
        { title: { [Op.iLike]: `%${request.query.search}%` } },
        { author: { [Op.iLike]: `%${request.query.search}%` } },
      ],
    }
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
    where,
    order: [['likes', 'DESC']],
  })

  response.json(blogs)
})

router.post('/', tokenExtractor, async (request, response) => {
  const user = await User.findByPk(request.decodedToken.id)
  const blog = await Blog.create({
    ...request.body,
    userId: user.id,
  })
  return response.json(blog)
})

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.delete('/:id', blogFinder, tokenExtractor, async (request, response) => {
  const user = await User.findByPk(request.decodedToken.id)

  if (request.blog.userId !== user.id) {
    return response.status(403).json({ error: 'user not authorized' })
  }

  if (request.blog) {
    await request.blog.destroy()
  }
  return response.status(204).end()
})

router.put('/:id', blogFinder, async (request, response) => {
  request.blog.likes = request.body.likes
  await request.blog.save()
  response.json(request.blog)
})

module.exports = router
