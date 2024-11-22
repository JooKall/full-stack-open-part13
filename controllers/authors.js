const router = require('express').Router()
const { Blog } = require('../models')
const { sequelize } = require('../utils/db')

router.get('/', async (request, response) => {
  const authors = await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('author')), 'blogs'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
    ],
    group: 'author',
    order: [['likes', 'DESC']],
  })

  response.json(authors)
})

module.exports = router
