import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const fallbackCalendars = [
  {
    id: 'winter-wishes',
    title: 'Winter Wishes',
    status: 'Draft',
    typeDays: 7,
    updated: 'Edited 2 days ago',
  },
  {
    id: 'cocoa-countdown',
    title: 'Cocoa Countdown',
    status: 'Live',
    typeDays: 7,
    updated: 'Edited today',
  },
]

function CalendarsPage() {
  const [calendars, setCalendars] = useState([])

  useEffect(() => {
    const stored = localStorage.getItem('adventCalendars')
    if (!stored) {
      setCalendars(fallbackCalendars)
      localStorage.setItem('adventCalendars', JSON.stringify(fallbackCalendars))
      return
    }

    try {
      const parsed = JSON.parse(stored)
      setCalendars(Array.isArray(parsed) ? parsed : fallbackCalendars)
    } catch {
      setCalendars(fallbackCalendars)
    }
  }, [])

  return (
    <div style={{ minHeight: '100vh', padding: '3rem', fontFamily: '"sofia-pro", "Gill Sans", sans-serif' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/app" style={{ textDecoration: 'underline' }}>
          Back to home base
        </Link>
      </div>
      <h1 style={{ fontFamily: '"hagrid", "sofia-pro", sans-serif', marginTop: 0 }}>Your Calendars</h1>
      <div className="calendar-grid" style={{ marginTop: '2rem' }}>
        {calendars.map((calendar, index) => (
          <article
            className="calendar-card"
            key={calendar.id}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div>
              <h4 style={{ margin: 0, fontSize: '1.2rem' }}>{calendar.title}</h4>
              <p style={{ margin: '0.35rem 0 0', fontSize: '0.85rem' }}>{calendar.updated}</p>
            </div>
            <div className="calendar-meta">
              <span className={`badge ${calendar.status === 'Live' ? 'live' : ''}`}>
                Status: {calendar.status}
              </span>
              <span className="badge">Type: {calendar.typeDays}-day</span>
            </div>
            <div className="card-actions">
              <Link className="pill-button" to={`/app/calendar/${calendar.id}/edit`}>
                Edit
              </Link>
              <Link className="pill-button secondary" to={`/app/calendar/${calendar.id}/preview`}>
                Preview
              </Link>
              <Link
                className="pill-button secondary"
                to={`/app/calendar/${calendar.id}/share`}
                aria-disabled={calendar.status !== 'Live'}
                onClick={event => {
                  if (calendar.status !== 'Live') event.preventDefault()
                }}
              >
                Share
              </Link>
            </div>
            <p className="share-note">Sharing unlocks once the calendar is Live.</p>
          </article>
        ))}
      </div>
    </div>
  )
}

export default CalendarsPage
