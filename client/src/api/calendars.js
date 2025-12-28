const API_BASE = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api/calendars`
const SHARE_BASE = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api/share`

async function handleResponse(response) {
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Calendar request failed')
  }
  return data
}

export async function createCalendar(payload) {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })
  return handleResponse(response)
}

export async function listCalendars() {
  const response = await fetch(API_BASE, { credentials: 'include' })
  return handleResponse(response)
}

export async function getCalendar(id) {
  const response = await fetch(`${API_BASE}/${id}`, { credentials: 'include' })
  return handleResponse(response)
}

export async function getCalendarById(id) {
  const res = await fetch(`${API_BASE}/${id}`, { credentials: 'include' })
  if (!res.ok) throw new Error(`GET calendar failed (${res.status})`)
  return res.json()
}

export async function updateCalendar(id, calendar) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(calendar),
  })
  if (!res.ok) throw new Error(`PUT calendar failed (${res.status})`)
  return res.json()
}

export async function deleteCalendar(id) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  if (!res.ok && res.status !== 204) {
    throw new Error(`DELETE calendar failed (${res.status})`)
  }
  return true
}

export async function publishCalendarShare(id, options = {}) {
  const res = await fetch(`${API_BASE}/${id}/share/publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(options),
  })
  if (!res.ok) throw new Error(`Publish share failed (${res.status})`)
  return res.json()
}

export async function unpublishCalendarShare(id) {
  const res = await fetch(`${API_BASE}/${id}/share/unpublish`, {
    method: 'POST',
    credentials: 'include',
  })
  if (!res.ok) throw new Error(`Unpublish share failed (${res.status})`)
  return res.json()
}

export async function regenerateCalendarShare(id) {
  const res = await fetch(`${API_BASE}/${id}/share/regenerate`, {
    method: 'POST',
    credentials: 'include',
  })
  if (!res.ok) throw new Error(`Regenerate share failed (${res.status})`)
  return res.json()
}

export async function getSharedCalendar(token) {
  const res = await fetch(`${SHARE_BASE}/${token}`)
  if (!res.ok) throw new Error(`GET shared calendar failed (${res.status})`)
  return res.json()
}
