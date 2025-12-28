import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getSharedCalendar } from '../api/calendars'

const fallbackDays = Array.from({ length: 7 }, (_, index) => ({
  id: index + 1,
  title: `Day ${index + 1}`,
  type: 'Message',
}))

function ShareCalendarDashboard() {
  const { shareToken } = useParams()
  const [calendar, setCalendar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!shareToken) return
    let alive = true

    async function loadCalendar() {
      try {
        setLoading(true)
        const data = await getSharedCalendar(shareToken)
        if (!alive) return
        setCalendar(data)
        setError('')
      } catch (err) {
        if (!alive) return
        setCalendar(null)
        setError('This share link is unavailable.')
      } finally {
        if (alive) setLoading(false)
      }
    }

    loadCalendar()
    return () => {
      alive = false
    }
  }, [shareToken])

  const days = useMemo(() => {
    const source = Array.isArray(calendar?.days) && calendar.days.length ? calendar.days : fallbackDays
    return source.map((day, index) => ({
      id: index + 1,
      title: day?.title || `Day ${index + 1}`,
      type: day?.type || 'Message',
    }))
  }, [calendar])

  if (loading) {
    return <div style={{ padding: '3rem' }}>Loading calendar…</div>
  }

  if (!calendar || error) {
    return (
      <div style={{ padding: '3rem' }}>
        <h2 style={{ margin: 0 }}>Calendar not available</h2>
        <p style={{ margin: '0.6rem 0 0' }}>{error || 'This link is no longer published.'}</p>
      </div>
    )
  }

  return (
    <div
      className="share-view-shell gradient-bg"
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
        .share-view-shell {
          color: var(--ink);
          background:
            radial-gradient(circle at 10% 10%, #ffe2a5, transparent 45%),
            radial-gradient(circle at 90% 0%, #f7d2ea, transparent 55%),
            radial-gradient(circle at 90% 90%, #d9f0df, transparent 50%),
            linear-gradient(120deg, #fff4e3, #fef7ef 45%, #fff3f9);
        }

        .share-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
        }

        .share-card {
          background: #fff;
          border: 1px solid #111;
          padding: 1.5rem;
          display: grid;
          gap: 0.75rem;
          box-shadow: 6px 6px 0 #111;
        }

        .share-button {
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

        .share-button:hover {
          background: linear-gradient(90deg, #ff9ac2, #fff);
          color: #111;
        }

        .instructions-wrap {
          position: relative;
          display: flex;
          justify-content: center;
          margin-top: 1rem;
        }

        .share-instructions {
          padding: 1.25rem 1.5rem;
          border: 2px solid rgba(176, 86, 128, 0.25);
          border-radius: 18px;
          background: transparent;
          max-width: 720px;
          box-shadow: 0 0 16px rgba(176, 42, 105, 0.35);
          text-align: center;
          color: #c34f85ff;
          animation: shareGlow 6.2s ease-in-out infinite;
        }

        @keyframes shareGlow {
          0% {
            box-shadow: 0 0 10px rgba(176, 42, 105, 0.25);
            border-color: rgba(176, 42, 105, 0.35);
          }
          50% {
            box-shadow: 0 0 24px rgba(176, 42, 105, 0.45);
            border-color: rgba(176, 42, 105, 0.6);
          }
          100% {
            box-shadow: 0 0 10px rgba(176, 42, 105, 0.25);
            border-color: rgba(176, 42, 105, 0.35);
          }
        }

        .instruction-decor {
          position: absolute;
          width: 64px;
          height: 64px;
          object-fit: contain;
          opacity: 0.9;
          pointer-events: none;
        }

        .decor-left-top {
          width: 150px;
          height: 150px;
          left: 200px;
          bottom: -45px;
        }

        .decor-left-bottom {
        width: 150px;
          height: 150px;
          left: 50px;
          bottom: 0px;
        }

        .decor-right-top {
          width: 150px;
          height: 150px;
          right: 200px;
          top: -30px;
        }

        .decor-right-bottom {
        width: 150px;
          height: 150px;
          right: 40px;
          bottom: -35px;
        }

        .share-footer-decor {
          margin-top: 2.5rem;
          display: flex;
          justify-content: center;
          gap: 20.5rem;
        }

        .share-footer-decor img {
          width: 120px;
          height: 120px;
          object-fit: contain;
          opacity: 0.9;
          pointer-events: none;
        }
      `}</style>

      <div style={{ marginBottom: '2rem' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: '0.5rem 1.5rem',
          }}
        >
          <h1 style={{ fontFamily: '"hagrid", "sofia-pro", sans-serif', margin: 0 }}>
            Calendar Name: {calendar.name || 'Shared Calendar'}
          </h1>
          <span style={{ fontSize: '1.3rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Created by: {calendar.createdBy || 'Unknown'}
          </span>
        </div>
        <div className="instructions-wrap">
          <img className="instruction-decor decor-left-top tilt" src="/pixel_box.png" alt="" />
          <img className="instruction-decor decor-left-bottom tilt-slow" src="/pixel_heart.png" alt="" />
          <div className="share-instructions">
            <p style={{ margin: 0, fontSize: '1rem' }}>
              This calendar was specially made for you by {calendar.createdBy || 'the creator'}.
            </p>
            <p style={{ margin: '0.6rem 0 0', fontSize: '0.95rem' }}>
              Open one day at a time for the best experience. Each day has a new surprise waiting.
            </p>
            <p style={{ margin: '0.6rem 0 0', fontSize: '0.9rem' }}>
              Try to save each day for its own moment - it will feel more magical.
            </p>
          </div>
          <img className="instruction-decor decor-right-top tilt-fast" src="/pixel_hearts.png" alt="" />
          <img className="instruction-decor decor-right-bottom tilt-slow" src="/pixel_moon.png" alt="" />
        </div>
      </div>

      <div className="share-grid">
        {days.map(day => (
          <article className="share-card" key={day.id}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{day.title}</h2>
              <p style={{ margin: '0.35rem 0 0', fontSize: '0.85rem' }}>
                {day.type}
              </p>
            </div>
            <Link className="share-button" to={`/share/${shareToken}/day/${day.id}`}>
              Open day
            </Link>
          </article>
        ))}
      </div>

      <div className="share-footer-decor">
        <img className="tilt" src="/check_bow.png" alt="" />
        <img className="tilt" src="/letter.png" alt="" />
      </div>
    </div>
  )
}

export default ShareCalendarDashboard
