const router = require('express').Router()
const jwt = require('jsonwebtoken')

const { Blog, User } = require('../models')
const { SECRET } = require('../utils/config')

router.get('/', async (request, response) => {
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
  })
  response.json(blogs)
})

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      console.log(authorization.substring(7))
      console.log(SECRET)
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch (error) {
      console.log(error)
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }

  next()
}

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
