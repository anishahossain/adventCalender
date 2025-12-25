import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listCalendars } from '../api/calendars'

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
    async function loadCalendars() {
      const stored = localStorage.getItem('adventCalendars')
      let localCalendars = []
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          localCalendars = Array.isArray(parsed) ? parsed : []
        } catch {
          localCalendars = []
        }
      }

      try {
        const data = await listCalendars()
        const apiCalendars = Array.isArray(data) ? data : []
        const merged = new Map()

        apiCalendars.forEach(calendar => merged.set(calendar.id, calendar))
        localCalendars.forEach(localCalendar => {
          const existing = merged.get(localCalendar.id)
          if (!existing) {
            merged.set(localCalendar.id, localCalendar)
            return
          }

          const apiUpdated = Date.parse(existing.updatedAt || 0)
          const localUpdated = Date.parse(localCalendar.updatedAt || 0)
          if (localUpdated > apiUpdated) {
            merged.set(localCalendar.id, localCalendar)
          }
        })

        const mergedList = Array.from(merged.values())
        setCalendars(mergedList.length ? mergedList : fallbackCalendars)
        localStorage.setItem('adventCalendars', JSON.stringify(mergedList))
        return
      } catch (err) {
        // Fall back to local draft storage if API is unavailable.
      }

      if (!localCalendars.length) {
        setCalendars(fallbackCalendars)
        localStorage.setItem('adventCalendars', JSON.stringify(fallbackCalendars))
        return
      }

      setCalendars(localCalendars)
    }

    loadCalendars()
  }, [])

  const displayCalendars = calendars.map(calendar => {
    if (calendar.title) return calendar
    return {
      id: calendar.id,
      title: calendar.name || 'Untitled Calendar',
      status: calendar.status || 'Draft',
      typeDays: calendar.days?.length || 7,
      updated: calendar.updatedAt ? `Updated ${new Date(calendar.updatedAt).toLocaleDateString()}` : 'Updated recently',
    }
  })

  return (
    <div
      className="calendars-shell gradient-bg"
      style={{
        minHeight: '100vh',
        padding: '3rem',
        fontFamily: '"sofia-pro", "Gill Sans", sans-serif',
        '--ink': '#201914',
        '--paper': '#fff7ea',
        '--accent': '#ff6fae',
        '--accent-strong': '#e45695',
      }}
    >
      <style>{`
        .calendars-shell {
          color: var(--ink);
          background:
            radial-gradient(circle at 10% 10%, #ffe2a5, transparent 45%),
            radial-gradient(circle at 90% 0%, #f7d2ea, transparent 55%),
            radial-gradient(circle at 90% 90%, #d9f0df, transparent 50%),
            linear-gradient(120deg, #fff4e3, #fef7ef 45%, #fff3f9);
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }

        .calendar-card {
          background: #fff;
          border: 1px solid #111;
          padding: 1.5rem;
          display: grid;
          gap: 0.85rem;
          box-shadow: 6px 6px 0 #111;
        }

        .calendar-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          font-size: 0.85rem;
        }

        .badge {
          padding: 0.2rem 0.6rem;
          border: 1px solid #111;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 0.65rem;
          background: #fff4d7;
        }

        .badge.live {
          background: #dcf7e5;
        }

        .card-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .pill-button {
          padding: 0.6rem 1rem;
          border: 1px solid #111;
          font-size: 0.85rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          background: #111;
          color: #fff;
          border-radius: 999px;
          transition: background 0.2s ease, color 0.2s ease;
        }

        .pill-button.secondary {
          background: transparent;
          color: #111;
        }

        .pill-button:hover {
          background: linear-gradient(90deg, #ff9ac2, #fff);
          color: #111;
        }

        .pill-button[aria-disabled="true"]:hover {
          background: transparent;
          color: #111;
        }

        .pill-button[disabled],
        .pill-button[aria-disabled="true"] {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .share-note {
          font-size: 0.75rem;
          margin: 0;
          color: #6b5548;
        }

        .home-link {
          display: inline-block;
          transition: transform 0.2s ease;
        }

        .home-link:hover {
          transform: scale(1.06);
        }

        .home-link-button {
          border: 1px solid #111;
          padding: 0.5rem 0.9rem;
          background: transparent;
          cursor: pointer;
          border-radius: 999px;
        }
      `}</style>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontFamily: '"hagrid", "sofia-pro", sans-serif', margin: 0 }}>Your Calendars</h1>
        <Link
          to="/app"
          className="home-link home-link-button"
          style={{
            margin: 0,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          Back to home base
        </Link>
      </div>
      <div className="calendar-grid" style={{ marginTop: '2rem' }}>
        {displayCalendars.map((calendar, index) => (
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
              <Link className="pill-button" to={`/app/calendars/${calendar.id}/edit`}>
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
