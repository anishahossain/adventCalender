const { Pool } = require('pg')
const crypto = require('crypto')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT ? Number(process.env.PGPORT) : undefined,
})

let initPromise

async function ensureTable() {
  if (!initPromise) {
    initPromise = pool.query(`
      CREATE TABLE IF NOT EXISTS calendars (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL,
        days JSONB NOT NULL,
        status TEXT NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL
      )
    `)
  }
  return initPromise
}

function defaultDays() {
  return Array.from({ length: 7 }, (_, index) => ({
    id: index + 1,
    title: `Day ${index + 1}`,
    content: '',
  }))
}

function toCalendar(row) {
  if (!row) return null
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    type: row.type,
    days: row.days,
    status: row.status,
    updatedAt: row.updated_at,
  }
}

async function listCalendars() {
  await ensureTable()
  const result = await pool.query('SELECT * FROM calendars ORDER BY updated_at DESC')
  return result.rows.map(toCalendar)
}

async function getCalendar(id) {
  await ensureTable()
  const result = await pool.query('SELECT * FROM calendars WHERE id = $1', [id])
  return toCalendar(result.rows[0])
}

async function createCalendar(payload) {
  await ensureTable()
  const calendar = {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
    name: payload.name || 'Untitled Calendar',
    description: payload.description || '',
    type: payload.type || '7-day',
    days: Array.isArray(payload.days) && payload.days.length ? payload.days : defaultDays(),
    status: payload.status || 'draft',
    updatedAt: new Date().toISOString(),
  }

  await pool.query(
    `
      INSERT INTO calendars (id, name, description, type, days, status, updated_at)
      VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7)
    `,
    [
      calendar.id,
      calendar.name,
      calendar.description,
      calendar.type,
      JSON.stringify(calendar.days),
      calendar.status,
      calendar.updatedAt,
    ]
  )

  return calendar
}

async function updateCalendar(id, payload) {
  await ensureTable()
  const existing = await getCalendar(id)
  if (!existing) return null

  const updated = {
    ...existing,
    ...payload,
    updatedAt: new Date().toISOString(),
  }

  await pool.query(
    `
      UPDATE calendars
      SET name = $1,
          description = $2,
          type = $3,
          days = $4::jsonb,
          status = $5,
          updated_at = $6
      WHERE id = $7
    `,
    [
      updated.name,
      updated.description,
      updated.type,
      JSON.stringify(updated.days),
      updated.status,
      updated.updatedAt,
      id,
    ]
  )

  return updated
}

module.exports = {
  listCalendars,
  getCalendar,
  createCalendar,
  updateCalendar,
}
