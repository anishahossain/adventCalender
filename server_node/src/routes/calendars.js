const express = require('express')
const store = require('../../db/postgresStore')

const router = express.Router()

router.get('/', async (req, res) => {
  const calendars = await store.listCalendars()
  res.json(calendars)
})

router.get('/:id', async (req, res) => {
  const calendar = await store.getCalendar(req.params.id)
  if (!calendar) {
    return res.status(404).json({ message: 'Calendar not found' })
  }
  res.json(calendar)
})

router.post('/', async (req, res) => {
  const payload = req.body || {}
  if (payload.name && typeof payload.name !== 'string') {
    return res.status(400).json({ message: 'Name must be a string.' })
  }
  if (payload.days && (!Array.isArray(payload.days) || payload.days.length !== 7)) {
    return res.status(400).json({ message: 'Days must be an array of 7 items.' })
  }
  if (payload.type && payload.type !== '7-day') {
    return res.status(400).json({ message: 'Only 7-day calendars are supported.' })
  }

  const calendar = await store.createCalendar(payload)
  res.status(201).json(calendar)
})

router.put('/:id', async (req, res) => {
  const payload = req.body || {}
  if (!payload.name || typeof payload.name !== 'string') {
    return res.status(400).json({ message: 'Name is required.' })
  }
  if (!payload.type || payload.type !== '7-day') {
    return res.status(400).json({ message: 'Type must be 7-day.' })
  }
  if (!Array.isArray(payload.days) || payload.days.length !== 7) {
    return res.status(400).json({ message: 'Days must be an array of 7 items.' })
  }

  const calendar = await store.updateCalendar(req.params.id, payload)
  if (!calendar) {
    return res.status(404).json({ message: 'Calendar not found' })
  }
  res.json(calendar)
})

module.exports = router
