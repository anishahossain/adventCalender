import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCalendarById } from '../api/calendars'

const dayGenres = [
  'Message',
  'Picture',
  'Special Song',
  'Book rec',
  'Virtual flowers',
  'A product link',
  'My favorite memory of you',
]

const days = Array.from({ length: 7 }, (_, index) => ({
  id: index + 1,
  title: `Day ${index + 1}`,
  status: 'Draft',
  genre: dayGenres[index] || 'Custom',
}))

function CreateDaysDashboard() {
  const { id } = useParams()
  const [calendarName, setCalendarName] = useState('')
  const [calendarStatus, setCalendarStatus] = useState('')

  useEffect(() => {
    if (!id) return

    let alive = true

    async function loadCalendar() {
      try {
        const calendar = await getCalendarById(id)
        if (!alive || !calendar) return
        localStorage.setItem('currentCalendarId', calendar.id)
        setCalendarName(calendar.name || '')
        const isPublished = Boolean(
          calendar.isPublished || (calendar.status || '').toLowerCase() === 'published'
        )
        setCalendarStatus(isPublished ? 'Published' : 'Draft')
      } catch (err) {
        setCalendarName('')
        setCalendarStatus('Draft')
      }
    }

    loadCalendar()
    return () => {
      alive = false
    }
  }, [id])

  return (
    <div
      className="days-shell gradient-bg"
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
        .days-shell {
          color: var(--ink);
          background:
            radial-gradient(circle at 10% 10%, #ffe2a5, transparent 45%),
            radial-gradient(circle at 90% 0%, #f7d2ea, transparent 55%),
            radial-gradient(circle at 90% 90%, #d9f0df, transparent 50%),
            linear-gradient(120deg, #fff4e3, #fef7ef 45%, #fff3f9);
        }

        .days-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
        }

        .day-card {
          background: #fff;
          border: 1px solid #111;
          padding: 1.5rem;
          display: grid;
          gap: 0.75rem;
          box-shadow: 6px 6px 0 #111;
        }

        .day-badge {
          padding: 0.2rem 0.6rem;
          border: 1px solid #111;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 0.65rem;
          background: #fff4d7;
          width: fit-content;
        }

        .day-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .day-button {
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

        .day-button.secondary {
          background: transparent;
          color: #111;
        }

        .day-button:hover {
          background: linear-gradient(90deg, #ff9ac2, #fff);
          color: #111;
        }
      `}</style>

      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: '"hagrid", "sofia-pro", sans-serif', margin: 0 }}>
            Build Your 7-Day Calendar
          </h1>
          <p style={{ margin: '0.4rem 0 0', fontSize: '1.5rem' }}>
            {calendarName ? `Working on: ${calendarName}` : 'Add a name to get started.'}
          </p>
          <p style={{ margin: '0.3rem 0 0', fontSize: '0.85rem' }}>
            Status: {calendarStatus || 'Draft'}
          </p>
          <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {id ? (
              <Link className="day-button" to={`/app/calendar/${id}/share`}>
                Complete & Share
              </Link>
            ) : (
              <button className="day-button" type="button" disabled>
                Complete & Share
              </button>
            )}
          </div>
        </div>
        <Link
          to="/app/calendars"
          style={{
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            color: 'inherit',
            border: '1px solid #111',
            padding: '0.5rem 0.9rem',
            borderRadius: '999px',
          }}
        >
          Back to your calendars
        </Link>
      </div>

      <div className="days-grid">
        {days.map(day => (
          <article className="day-card" key={day.id}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{day.title}</h2>
              <p style={{ margin: '0.35rem 0 0', fontSize: '0.85rem' }}>
                {day.genre}
              </p>
            </div>
            <span className="day-badge">Status: {day.status}</span>
            <div className="day-actions">
              <Link className="day-button" to={`/app/calendar/day/${day.id}/edit`}>
                Edit
              </Link>
              <Link className="day-button secondary" to={`/app/calendar/day/${day.id}/preview`}>
                Preview
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default CreateDaysDashboard
