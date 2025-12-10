const express = require('express')
const crypto = require('crypto')

const router = express.Router()

// In-memory user list – resets when server restarts
const users = []

// Very basic password check – NOT for production
function findUserByEmail(email) {
  return users.find(u => u.email.toLowerCase() === email.toLowerCase())
}

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email, and password are required' })
  }

  if (findUserByEmail(email)) {
    return res.status(409).json({ message: 'Email already registered' })
  }

  const id = crypto.randomUUID()
  const user = { id, name, email, password } // plain text for now (fake auth only)

  users.push(user)

  // fake token
  const token = `fake-token-${id}`

  res.status(201).json({
    user: { id, name, email },
    token,
  })
})

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' })
  }

  const user = findUserByEmail(email)
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  const token = `fake-token-${user.id}`

  res.json({
    user: { id: user.id, name: user.name, email: user.email },
    token,
  })
})

module.exports = router
