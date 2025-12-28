import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createCalendar } from '../api/calendars'

function CreateCalendarPage() {
  const [calendarName, setCalendarName] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleStartBuilding() {
    setIsSubmitting(true)
    setError('')
    const draft = {
      name: calendarName || 'Untitled Calendar',
      description,
      type: '7-day',
      status: 'draft',
    }

    try {
      const created = await createCalendar(draft)
      localStorage.setItem('currentCalendarId', created.id)
      navigate(`/app/calendars/${created.id}/edit`)
    } catch (err) {
      setError(err.message || 'Unable to create calendar.')
    }
    setIsSubmitting(false)
  }

  return (
    <div
      className="create-shell gradient-bg"
      style={{
        minHeight: '100vh',
        position: 'relative', // 👈 ADD THIS
        overflow: 'hidden',   // 👈 prevents scrollbars
        padding: '3rem',
        fontFamily: '"sofia-pro", "Gill Sans", sans-serif',
        '--ink': '#201914',
        '--paper': '#fff7ea',
        '--accent': '#ff6fae',
        '--accent-strong': '#e45695',
      }}
    >
      <style>{`
        .create-shell {
          color: var(--ink);
          background:
            radial-gradient(circle at 10% 10%, #ffe2a5, transparent 45%),
            radial-gradient(circle at 90% 0%, #f7d2ea, transparent 55%),
            radial-gradient(circle at 90% 90%, #d9f0df, transparent 50%),
            linear-gradient(120deg, #fff4e3, #fef7ef 45%, #fff3f9);
        }

        .create-card {
          background: var(--paper);
          border: 2px solid #111;
          box-shadow: 10px 10px 0 #111;
          padding: 2.5rem;
          max-width: 720px;
        }

        .create-label {
          display: block;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 0.4rem;
        }

        .create-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #111;
          font-size: 0.95rem;
          background: #fff;
        }

        .create-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }

        .create-button {
          padding: 0.75rem 1.2rem;
          border: 1px solid #111;
          font-size: 0.9rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          border-radius: 999px;
          transition: background 0.2s ease, color 0.2s ease;
          background: var(--accent);
          color: #fff;
          border-color: var(--accent-strong);
        }

        .create-button.secondary {
          background: transparent;
          color: var(--ink);
          border-color: #111;
        }

        .create-button:hover {
          background: linear-gradient(90deg, #ff9ac2, #fff);
          color: #111;
        }
      `}</style>

      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: '"hagrid", "sofia-pro", sans-serif', margin: 0 }}>
            Create a New Advent Calendar
          </h1>
          <p style={{ margin: '0.4rem 0 0' }}>
            {calendarName ? `Working on: ${calendarName}` : 'Add a name to get started.'}
          </p>
        </div>
        <Link
          to="/app"
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
          Back to home base
        </Link>
      </div>

      <div className="create-card" style={{ margin: '0 auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="create-label">Calendar Name</label>
          <input
            className="create-input"
            placeholder="Ex: Winter Wishes"
            value={calendarName}
            onChange={event => setCalendarName(event.target.value)}
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="create-label">Description</label>
          <input
            className="create-input"
            placeholder="Short note for the recipient..."
            value={description}
            onChange={event => setDescription(event.target.value)}
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="create-label">Type</label>
          <input className="create-input" defaultValue="7-day" readOnly />
        </div>
        <div className="create-actions">
          <button className="create-button" type="button" disabled={isSubmitting} onClick={handleStartBuilding}>
            {isSubmitting ? 'Starting...' : 'Start Building'}
          </button>
          <Link className="create-button secondary" to="/app/calendars">
            View Existing Calendars
          </Link>
        </div>
        {error ? (
          <p style={{ marginTop: '1rem', color: '#b42318', fontSize: '0.9rem' }}>
            {error}
          </p>
        ) : null}
        <img
  src="/pink_bow.png"
  alt=""
  className="tilt"
  style={{
    position: 'absolute',
   bottom: '6rem',   // ⬆ higher
    left: '6rem',   // ➡ pushed inward
    width: '270px',   // 🔍 bigger
    opacity: 0.9,
    pointerEvents: 'none',
  }}
/>

<img
  src="/glass_heart.png"
  alt=""
  className="tilt"
  style={{
    
    position: 'absolute',
    bottom: '7rem', // ⬆ higher
    right: '8rem',  // ⬅ pushed inward
    width: '170px',   // 🔍 bigger
    opacity: 0.9,
    pointerEvents: 'none',
  }}
/>

      </div>
      
    </div>
  )
}

export default CreateCalendarPage
