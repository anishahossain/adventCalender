import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteCalendar, listCalendars } from '../api/calendars'

function CalendarsPage() {
  const [calendars, setCalendars] = useState([])
  const [deletingId, setDeletingId] = useState(null)
  const [deleteError, setDeleteError] = useState('')
  const [deleteErrorId, setDeleteErrorId] = useState('')

  useEffect(() => {
    async function loadCalendars() {
      try {
        const data = await listCalendars()
        const apiCalendars = Array.isArray(data) ? data : []
        setCalendars(apiCalendars)
        return
      } catch (err) {
        setCalendars([])
      }
    }

    loadCalendars()
  }, [])

  async function handleDeleteCalendar(calendar) {
    if (!calendar?.id) return
    if (calendar.isPublished) return
    const status = (calendar.status || '').toLowerCase()
    if (status === 'published') return
    const confirmed = window.confirm(`Delete "${calendar.title || calendar.name || 'this calendar'}"?`)
    if (!confirmed) return
    setDeleteError('')
    setDeleteErrorId('')
    setDeletingId(calendar.id)
    try {
      await deleteCalendar(calendar.id)
      setCalendars(prev => prev.filter(item => item.id !== calendar.id))
    } catch (err) {
      setDeleteError(err.message || 'Unable to delete calendar.')
      setDeleteErrorId(calendar.id)
    } finally {
      setDeletingId(null)
    }
  }

  const displayCalendars = calendars.map(calendar => {
    if (calendar.title) return calendar
    const isPublished = Boolean(calendar.isPublished || (calendar.status || '').toLowerCase() === 'published')
    return {
      id: calendar.id,
      title: calendar.name || 'Untitled Calendar',
      status: isPublished ? 'Published' : 'Draft',
      isPublished,
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
      {displayCalendars.length === 0 ? (
        <div
          style={{
            marginTop: '2.5rem',
            padding: '2rem',
            border: '1px solid #111',
            background: '#fff',
            boxShadow: '6px 6px 0 #111',
            maxWidth: '520px',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '1.4rem' }}>You currently have no calendars.</h2>
          <p style={{ margin: '0.6rem 0 1.2rem' }}>
            Go ahead and make one!
          </p>
          <Link className="pill-button" to="/app/create">
            Create a new calendar
          </Link>
        </div>
      ) : (
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
                <span className={`badge ${calendar.isPublished ? 'live' : ''}`}>
                  Status: {calendar.status}
                </span>
                <span className="badge">Type: {calendar.typeDays}-day</span>
              </div>
            <div className="card-actions">
              <Link className="pill-button" to={`/app/calendars/${calendar.id}/edit`}>
                Edit
              </Link>
              <Link
                className="pill-button secondary"
                to={`/app/calendar/${calendar.id}/share`}
                >
                  Share
                </Link>
                {!calendar.isPublished ? (
                  <button
                    className="pill-button secondary"
                    type="button"
                    disabled={deletingId === calendar.id}
                    onClick={() => handleDeleteCalendar(calendar)}
                  >
                    {deletingId === calendar.id ? 'Deleting...' : 'Delete'}
                  </button>
                ) : null}
              </div>
              <p className="share-note">Draft calendars are private. Publish to share.</p>
              {deleteError && deleteErrorId === calendar.id ? (
                <p className="share-note" style={{ color: '#b42318' }}>
                  {deleteError}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default CalendarsPage
