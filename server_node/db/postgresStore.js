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

let initCalendarsPromise
let initUsersPromise

async function ensureCalendarsTable() {
  if (!initCalendarsPromise) {
    initCalendarsPromise = (async () => {
      await ensureUsersTable()
      await pool.query(`
        CREATE TABLE IF NOT EXISTS calendars (
          id TEXT PRIMARY KEY,
          user_id UUID NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          type TEXT NOT NULL,
          days JSONB NOT NULL,
          status TEXT NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL
        )
      `)
      await pool.query(`
        ALTER TABLE calendars
        ADD COLUMN IF NOT EXISTS user_id UUID
      `)
      await pool.query(`
        ALTER TABLE calendars
        ADD COLUMN IF NOT EXISTS share_token TEXT
      `)
      await pool.query(`
        ALTER TABLE calendars
        ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT FALSE
      `)
      await pool.query(`
        ALTER TABLE calendars
        ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ
      `)
      await pool.query(`
        CREATE INDEX IF NOT EXISTS calendars_user_id_idx
        ON calendars (user_id)
      `)
      await pool.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS calendars_share_token_idx
        ON calendars (share_token)
      `)
      await pool.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1
            FROM pg_constraint
            WHERE conname = 'calendars_user_id_fkey'
          ) THEN
            ALTER TABLE calendars
            ADD CONSTRAINT calendars_user_id_fkey
            FOREIGN KEY (user_id) REFERENCES users(id);
          END IF;
        END
        $$;
      `)
      await pool.query(`
        UPDATE calendars
        SET is_published = TRUE,
            status = 'published'
        WHERE is_published = FALSE
          AND lower(status) IN ('live', 'published')
      `)
    })()
  }
  return initCalendarsPromise
}

async function ensureUsersTable() {
  if (!initUsersPromise) {
    initUsersPromise = pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL
      )
    `)
  }
  return initUsersPromise
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
    userId: row.user_id,
    name: row.name,
    description: row.description,
    type: row.type,
    days: row.days,
    status: row.status,
    shareToken: row.share_token,
    isPublished: row.is_published,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
  }
}

function toSharedCalendar(row) {
  if (!row) return null
  return {
    name: row.name,
    description: row.description,
    createdBy: row.username,
    type: row.type,
    days: row.days,
    status: row.status,
    publishedAt: row.published_at,
  }
}

function normalizeStatus(status, isPublished) {
  if (typeof isPublished === 'boolean') {
    return isPublished ? 'published' : 'draft'
  }
  if (!status) return 'draft'
  const normalized = status.toLowerCase()
  return normalized === 'published' || normalized === 'live' ? 'published' : 'draft'
}

function generateShareToken() {
  return crypto.randomBytes(24).toString('hex')
}

async function listCalendars(userId) {
  await ensureCalendarsTable()
  const result = await pool.query(
    'SELECT * FROM calendars WHERE user_id = $1 ORDER BY updated_at DESC',
    [userId]
  )
  return result.rows.map(toCalendar)
}

async function getCalendar(userId, id) {
  await ensureCalendarsTable()
  const result = await pool.query(
    'SELECT * FROM calendars WHERE user_id = $1 AND id = $2',
    [userId, id]
  )
  return toCalendar(result.rows[0])
}

async function createCalendar(userId, payload) {
  await ensureCalendarsTable()
  const normalizedStatus = normalizeStatus(payload.status, payload.isPublished)
  const calendar = {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
    userId,
    name: payload.name || 'Untitled Calendar',
    description: payload.description || '',
    type: payload.type || '7-day',
    days: Array.isArray(payload.days) && payload.days.length ? payload.days : defaultDays(),
    status: normalizedStatus,
    shareToken: null,
    isPublished: normalizedStatus === 'published',
    publishedAt: normalizedStatus === 'published' ? new Date().toISOString() : null,
    updatedAt: new Date().toISOString(),
  }

  await pool.query(
    `
      INSERT INTO calendars (id, user_id, name, description, type, days, status, share_token, is_published, published_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11)
    `,
    [
      calendar.id,
      calendar.userId,
      calendar.name,
      calendar.description,
      calendar.type,
      JSON.stringify(calendar.days),
      calendar.status,
      calendar.shareToken,
      calendar.isPublished,
      calendar.publishedAt,
      calendar.updatedAt,
    ]
  )

  return calendar
}

async function updateCalendar(userId, id, payload) {
  await ensureCalendarsTable()
  const existing = await getCalendar(userId, id)
  if (!existing) return null
  const normalizedStatus = normalizeStatus(payload.status ?? existing.status, payload.isPublished)

  const updated = {
    ...existing,
    ...payload,
    userId,
    status: normalizedStatus,
    isPublished: payload.isPublished ?? normalizedStatus === 'published',
    shareToken: payload.shareToken ?? existing.shareToken,
    publishedAt:
      normalizedStatus === 'published'
        ? payload.publishedAt ?? existing.publishedAt
        : null,
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
          share_token = $6,
          is_published = $7,
          published_at = $8,
          updated_at = $9
      WHERE user_id = $10 AND id = $11
    `,
    [
      updated.name,
      updated.description,
      updated.type,
      JSON.stringify(updated.days),
      updated.status,
      updated.shareToken,
      updated.isPublished,
      updated.publishedAt,
      updated.updatedAt,
      userId,
      id,
    ]
  )

  return updated
}

async function publishCalendar(userId, id, { regenerate = false } = {}) {
  await ensureCalendarsTable()
  const existing = await getCalendar(userId, id)
  if (!existing) return null

  const shareToken = regenerate || !existing.shareToken ? generateShareToken() : existing.shareToken
  const publishedAt = new Date().toISOString()

  await pool.query(
    `
      UPDATE calendars
      SET share_token = $1,
          is_published = TRUE,
          status = 'published',
          published_at = $2,
          updated_at = $3
      WHERE user_id = $4 AND id = $5
    `,
    [shareToken, publishedAt, new Date().toISOString(), userId, id]
  )

  return {
    ...existing,
    shareToken,
    isPublished: true,
    status: 'published',
    publishedAt,
    updatedAt: new Date().toISOString(),
  }
}

async function unpublishCalendar(userId, id) {
  await ensureCalendarsTable()
  const existing = await getCalendar(userId, id)
  if (!existing) return null

  await pool.query(
    `
      UPDATE calendars
      SET is_published = FALSE,
          status = 'draft',
          published_at = NULL,
          updated_at = $1
      WHERE user_id = $2 AND id = $3
    `,
    [new Date().toISOString(), userId, id]
  )

  return {
    ...existing,
    isPublished: false,
    status: 'draft',
    publishedAt: null,
    updatedAt: new Date().toISOString(),
  }
}

async function getSharedCalendarByToken(token) {
  await ensureCalendarsTable()
  const result = await pool.query(
    `
      SELECT calendars.name,
             calendars.description,
             calendars.type,
             calendars.days,
             calendars.status,
             calendars.published_at,
             users.username
      FROM calendars
      JOIN users ON users.id = calendars.user_id
      WHERE share_token = $1 AND is_published = TRUE
    `,
    [token]
  )
  return toSharedCalendar(result.rows[0])
}

async function deleteCalendar(userId, id) {
  await ensureCalendarsTable()
  const result = await pool.query(
    'DELETE FROM calendars WHERE user_id = $1 AND id = $2',
    [userId, id]
  )
  return result.rowCount > 0
}

function toUser(row) {
  if (!row) return null
  return {
    id: row.id,
    username: row.username,
    passwordHash: row.password_hash,
    createdAt: row.created_at,
  }
}

async function findUserByUsername(username) {
  await ensureUsersTable()
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username])
  return toUser(result.rows[0])
}

async function getUserById(id) {
  await ensureUsersTable()
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id])
  return toUser(result.rows[0])
}

async function createUser({ id, username, passwordHash }) {
  await ensureUsersTable()
  const createdAt = new Date().toISOString()
  await pool.query(
    `
      INSERT INTO users (id, username, password_hash, created_at)
      VALUES ($1, $2, $3, $4)
    `,
    [id, username, passwordHash, createdAt]
  )
  return {
    id,
    username,
    passwordHash,
    createdAt,
  }
}

module.exports = {
  listCalendars,
  getCalendar,
  createCalendar,
  updateCalendar,
  publishCalendar,
  unpublishCalendar,
  getSharedCalendarByToken,
  deleteCalendar,
  findUserByUsername,
  createUser,
  getUserById,
}
