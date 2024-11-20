const router = require('express').Router()
const Blog = require('../models/blog')
//const userExtractor = require('../utils/middleware').userExtractor

router.get('/', async (request, response) => {
  const blogs = await Blog.findAll()
  response.json(blogs)
})

router.post('/', async (request, response) => {
  try {
    const blog = await Blog.create(request.body)
    return response.json(blog)
  } catch (error) {
    return response.status(400).json({ error })
  }
})

router.delete('/:id', async (request, response) => {
  const blog = await Blog.findByPk(request.params.id)
  await blog.destroy()

  return response.status(204).end()
})

// router.put('/:id', async (request, response) => {
//   const body = request.body

//   const blog = {
//     title: body.title,
//     author: body.author,
//     url: body.url,
//     likes: body.likes
//   }

//   const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
//   response.json(updatedBlog)
// })

module.exports = router
