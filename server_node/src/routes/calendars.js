const express = require('express')
const store = require('../../db/postgresStore')

const router = express.Router()

function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: 'not authenticated' })
  }
  next()
}

router.use(requireAuth)

router.get('/', async (req, res) => {
  const calendars = await store.listCalendars(req.session.userId)
  res.json(calendars)
})

router.get('/:id', async (req, res) => {
  const calendar = await store.getCalendar(req.session.userId, req.params.id)
  if (!calendar) {
    return res.status(404).json({ message: 'Calendar not found' })
  }
  res.json(calendar)
})

router.post('/:id/share/publish', async (req, res) => {
  const payload = req.body || {}
  const calendar = await store.publishCalendar(req.session.userId, req.params.id, {
    regenerate: Boolean(payload.regenerate),
  })
  if (!calendar) {
    return res.status(404).json({ message: 'Calendar not found' })
  }
  res.json(calendar)
})

router.post('/:id/share/unpublish', async (req, res) => {
  const calendar = await store.unpublishCalendar(req.session.userId, req.params.id)
  if (!calendar) {
    return res.status(404).json({ message: 'Calendar not found' })
  }
  res.json(calendar)
})

router.post('/:id/share/regenerate', async (req, res) => {
  const calendar = await store.publishCalendar(req.session.userId, req.params.id, {
    regenerate: true,
  })
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

  const calendar = await store.createCalendar(req.session.userId, payload)
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

  const calendar = await store.updateCalendar(req.session.userId, req.params.id, payload)
  if (!calendar) {
    return res.status(404).json({ message: 'Calendar not found' })
  }
  res.json(calendar)
})

router.delete('/:id', async (req, res) => {
  const calendar = await store.getCalendar(req.session.userId, req.params.id)
  if (!calendar) {
    return res.status(404).json({ message: 'Calendar not found' })
  }
  if (calendar.isPublished || (calendar.status || '').toLowerCase() === 'published') {
    return res.status(409).json({ message: 'Calendar must be draft to delete.' })
  }
  const deleted = await store.deleteCalendar(req.session.userId, req.params.id)
  if (!deleted) {
    return res.status(404).json({ message: 'Calendar not found' })
  }
  res.status(204).end()
})

module.exports = router
