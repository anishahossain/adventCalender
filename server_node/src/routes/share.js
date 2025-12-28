const express = require('express')
const store = require('../../db/postgresStore')

const router = express.Router()

router.get('/:token', async (req, res) => {
  const calendar = await store.getSharedCalendarByToken(req.params.token)
  if (!calendar) {
    return res.status(404).json({ message: 'Calendar not found' })
  }
  res.json(calendar)
})

module.exports = router
