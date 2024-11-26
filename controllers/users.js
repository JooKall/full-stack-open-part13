const router = require('express').Router()

const { User, Blog } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] },
    },
  })
  res.json(users)
})

router.get('/:id', async (req, res) => {
  const where = {}

  if (req.query.read) {
    where.read = req.query.read
  }

  const { id } = req.params

  const user = await User.findByPk(id, {
    attributes: ['username', 'name'],
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: ['id', 'author', 'title', 'url', 'likes', 'year'],
        through: {
          as: 'readinglists',
          attributes: ['id', 'read'],
          where,
        },
      },
    ],
  })

  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.post('/', async (req, res) => {
  const user = await User.create(req.body)
  res.json(user)
})

const userFinder = async (req, res, next) => {
  req.user = await User.findOne({ where: { username: req.params.username } })
  next()
}

router.put('/:username', userFinder, async (req, res) => {
  req.user.name = req.body.name
  await req.user.save()
  res.json(req.user)
})

module.exports = router
