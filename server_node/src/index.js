const express = require('express')
const cors = require('cors')
const session = require('express-session')
const authRoutes = require('./routes/auth')
const calendarRoutes = require('./routes/calendars')
const shareRoutes = require('./routes/share')

const app = express()
const PORT = 4000

app.use(cors({
  origin: 'http://localhost:5173', // Vite default
  credentials: true
}))
app.use(express.json({ limit: '25mb' }))
app.use(session({
  name: 'sid',
  secret: process.env.SESSION_SECRET || 'dev-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
}))

app.use('/api/auth', authRoutes)
app.use('/api/calendars', calendarRoutes)
app.use('/api/share', shareRoutes)

app.get('/', (req, res) => {
  res.send('Advent Calendar API – Phase 0')
})

app.listen(PORT, () => {
  console.log(`Node API listening on http://localhost:${PORT}`)
})
