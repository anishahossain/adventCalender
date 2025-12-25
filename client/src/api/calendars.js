const API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/calendars`

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
    body: JSON.stringify(payload),
  })
  return handleResponse(response)
}

export async function listCalendars() {
  const response = await fetch(API_BASE)
  return handleResponse(response)
}

export async function getCalendar(id) {
  const response = await fetch(`${API_BASE}/${id}`)
  return handleResponse(response)
}

export async function getCalendarById(id) {
  const res = await fetch(`${API_BASE}/${id}`)
  if (!res.ok) throw new Error(`GET calendar failed (${res.status})`)
  return res.json()
}

export async function updateCalendar(id, calendar) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(calendar),
  })
  if (!res.ok) throw new Error(`PUT calendar failed (${res.status})`)
  return res.json()
}
