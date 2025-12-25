import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getCalendarById } from '../api/calendars'

const fallbackDay = {
  dayNumber: 1,
  type: 'Message',
  cardColor: '#ffcadc',
  bgMode: 'color',
  bgImage: '',
  font: 'hagrid',
  message: '',
}

function DayPreviewPage() {
  const { id } = useParams()
  const dayNumber = useMemo(() => Number(id) || 1, [id])
  const calendarId = useMemo(() => localStorage.getItem('currentCalendarId'), [])
  const [dayData, setDayData] = useState(fallbackDay)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true

    async function load() {
      try {
        setLoading(true)
        const remote = calendarId ? await getCalendarById(calendarId) : null
        const localCache = calendarId ? localStorage.getItem(`calendar:${calendarId}`) : null
        const calendar = remote || (localCache ? JSON.parse(localCache) : null)

        if (!alive) return

        const dayIndex = Math.max(0, dayNumber - 1)
        const day = calendar?.days?.[dayIndex] || fallbackDay
        setDayData({
          ...fallbackDay,
          ...day,
          dayNumber,
        })
      } catch {
        if (!alive) return
        setDayData({ ...fallbackDay, dayNumber })
      } finally {
        if (alive) setLoading(false)
      }
    }

    load()
    return () => {
      alive = false
    }
  }, [calendarId, dayNumber])

  const previewStyle = useMemo(() => {
    if (dayData.bgMode === 'image' && dayData.bgImage) {
      return {
        backgroundImage: `url(${dayData.bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    }

    return { background: dayData.cardColor }
  }, [dayData])

  if (loading) {
    return <div style={{ padding: '3rem' }}>Loading preview…</div>
  }

  return (
    <div
      className="day-preview-shell gradient-bg"
      style={{
        minHeight: '100vh',
        padding: '3rem',
        fontFamily: '"sofia-pro", "Gill Sans", sans-serif',
        '--ink': '#201914',
        '--paper': '#fff7ea',
      }}
    >
      <style>{`
        .day-preview-shell {
          color: var(--ink);
          background:
            radial-gradient(circle at 10% 10%, #ffe2a5, transparent 45%),
            radial-gradient(circle at 90% 0%, #f7d2ea, transparent 55%),
            radial-gradient(circle at 90% 90%, #d9f0df, transparent 50%),
            linear-gradient(120deg, #fff4e3, #fef7ef 45%, #fff3f9);
        }

        .preview-frame {
          background: #fff;
          border: 2px solid #111;
          box-shadow: 10px 10px 0 #111;
          border-radius: 18px;
          padding: 2.5rem;
          max-width: 640px;
          margin: 3rem auto 0;
        }

        .preview-card {
          border: 2px solid #111;
          border-radius: 18px;
          padding: 2rem;
          min-height: 320px;
          display: grid;
          gap: 0.85rem;
          align-content: center;
          text-align: center;
        }

        .preview-message {
          display: inline-block;
          align-self: center;
          background: rgba(255, 255, 255, 0.85);
          padding: 0.4rem 0.85rem;
          border-radius: 999px;
          border: 1px solid #111;
          font-weight: 700;
          font-size: 1.15rem;
        }

        .preview-image {
          width: 100%;
          max-height: 320px;
          object-fit: contain;
          border-radius: 16px;
          border: 2px solid #111;
          background: #fff;
        }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontFamily: '"hagrid", "sofia-pro", sans-serif', margin: 0 }}>
          Day {dayNumber} Preview
        </h1>
        <Link
          to="/app/create/days"
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
          Back to days
        </Link>
      </div>

      <div className="preview-frame">
        <div className="preview-card" style={{ ...previewStyle, fontFamily: dayData.font || 'hagrid' }}>
          <p style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Day {dayNumber}</p>
          <h2 style={{ margin: 0, fontSize: '1rem' }}>{dayData.type || 'Message'}</h2>
          {dayData.photoData ? (
            <img className="preview-image" src={dayData.photoData} alt={`Day ${dayNumber} upload`} />
          ) : (
            <p className="preview-message">
              {dayData.message?.trim() ? dayData.message : 'Your message preview will appear here…'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default DayPreviewPage
