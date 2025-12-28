const express = require('express')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const store = require('../../db/postgresStore')

const router = express.Router()

function toPublicUser(user) {
  return {
    id: user.id,
    username: user.username,
    createdAt: user.createdAt,
  }
}

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { username, password } = req.body || {}

  if (!username || !password) {
    return res.status(400).json({ message: 'username and password are required' })
  }

  const existing = await store.findUserByUsername(username)
  if (existing) {
    return res.status(409).json({ message: 'username already in use' })
  }

  const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await store.createUser({ id, username, passwordHash })

  req.session.userId = user.id
  res.status(201).json({ user: toPublicUser(user) })
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body || {}

  if (!username || !password) {
    return res.status(400).json({ message: 'username and password are required' })
  }

  const user = await store.findUserByUsername(username)
  const passwordOk = user ? await bcrypt.compare(password, user.passwordHash) : false
  if (!user || !passwordOk) {
    return res.status(401).json({ message: 'invalid username/password' })
  }

  req.session.userId = user.id
  res.json({ user: toPublicUser(user) })
})

// GET /api/auth/me
router.get('/me', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'not authenticated' })
  }

  const user = await store.getUserById(req.session.userId)
  if (!user) {
    return res.status(401).json({ message: 'not authenticated' })
  }

  res.json({ user: toPublicUser(user) })
})

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('sid')
    res.status(204).end()
  })
})

module.exports = router
