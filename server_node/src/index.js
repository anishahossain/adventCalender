const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/auth')
const calendarRoutes = require('./routes/calendars')

const app = express()
const PORT = 4000

app.use(cors({
  origin: 'http://localhost:5173', // Vite default
  credentials: false
}))
app.use(express.json({ limit: '25mb' }))

app.use('/api/auth', authRoutes)
app.use('/api/calendars', calendarRoutes)

app.get('/', (req, res) => {
  res.send('Advent Calendar API – Phase 0')
})

app.listen(PORT, () => {
  console.log(`Node API listening on http://localhost:${PORT}`)
})
