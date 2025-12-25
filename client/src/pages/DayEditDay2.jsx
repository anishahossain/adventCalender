import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCalendarById, updateCalendar } from '../api/calendars'

const fonts = ['hagrid', 'sofia-pro', 'Edu NSW ACT Cursive', 'Gill Sans', 'Georgia']
const colorOptions = ['#ffcadc', '#ffe7b3', '#cfe8ff', '#d9f0df', '#f5d2ff']

const DEFAULT_DAY = {
  type: 'Picture',
  cardColor: colorOptions[0],
  font: fonts[0],
  photoData: '',
  updatedAt: '',
}

function DayEditDay2() {
  const dayNumber = 2
  const dayIndex = 1
  const genreLabel = 'Picture'
  const calendarId = useMemo(() => localStorage.getItem('currentCalendarId'), [])

  const [calendar, setCalendar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState('idle')

  const [cardColor, setCardColor] = useState(colorOptions[0])
  const [font, setFont] = useState(fonts[0])
  const [photoData, setPhotoData] = useState('')

  const saveTimerRef = useRef(null)
  const lastSaveTokenRef = useRef(0)

  useEffect(() => {
    let alive = true

    async function load() {
      try {
        setLoading(true)
        const remote = calendarId ? await getCalendarById(calendarId) : null
        const localCache = calendarId
          ? localStorage.getItem(`calendar:${calendarId}`)
          : null
        const cal = remote || (localCache ? JSON.parse(localCache) : null)
        if (!alive) return

        setCalendar(cal)

        const day = cal?.days?.[dayIndex] || DEFAULT_DAY
        setCardColor(day.cardColor ?? colorOptions[0])
        setFont(day.font ?? fonts[0])
        setPhotoData(day.photoData ?? '')
      } catch (err) {
        if (!alive) return
        setSaveStatus('error')
      } finally {
        if (alive) setLoading(false)
      }
    }

    load()
    return () => {
      alive = false
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [calendarId])

  function scheduleSave(nextCal) {
    if (!calendarId || !nextCal) return

    localStorage.setItem(`calendar:${calendarId}`, JSON.stringify(nextCal))
    setSaveStatus('saving')

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    const token = ++lastSaveTokenRef.current

    saveTimerRef.current = setTimeout(async () => {
      try {
        await updateCalendar(calendarId, nextCal)
        if (token !== lastSaveTokenRef.current) return
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 1200)
      } catch (err) {
        if (token !== lastSaveTokenRef.current) return
        setSaveStatus('error')
      }
    }, 900)
  }

  function updateDay(patch) {
    if ('cardColor' in patch) setCardColor(patch.cardColor)
    if ('font' in patch) setFont(patch.font)
    if ('photoData' in patch) setPhotoData(patch.photoData)

    setCalendar(prev => {
      if (!prev) return prev
      const days = Array.isArray(prev.days)
        ? [...prev.days]
        : Array.from({ length: 7 }, () => ({ ...DEFAULT_DAY }))
      const prevDay = days[dayIndex] || { ...DEFAULT_DAY }

      const nextDay = {
        ...prevDay,
        dayNumber,
        type: genreLabel,
        cardColor: patch.cardColor ?? cardColor,
        font: patch.font ?? font,
        photoData: patch.photoData ?? photoData,
        updatedAt: new Date().toISOString(),
      }

      days[dayIndex] = nextDay
      const nextCal = {
        ...prev,
        days,
        updatedAt: new Date().toISOString(),
      }

      scheduleSave(nextCal)
      return nextCal
    })
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      updateDay({ photoData: result })
    }
    reader.readAsDataURL(file)
  }

  if (!calendarId) {
    return (
      <div style={{ padding: '3rem' }}>
        <h2>No calendar selected</h2>
        <p>Go back and click “Start Building” to create/select a calendar first.</p>
        <Link to="/app">Back to home base</Link>
      </div>
    )
  }

  if (loading) {
    return <div style={{ padding: '3rem' }}>Loading Day 2…</div>
  }

  return (
    <div
      className="day-edit-shell gradient-bg"
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
        .day-edit-shell {
          color: var(--ink);
          background:
            radial-gradient(circle at 10% 10%, #ffe2a5, transparent 45%),
            radial-gradient(circle at 90% 0%, #f7d2ea, transparent 55%),
            radial-gradient(circle at 90% 90%, #d9f0df, transparent 50%),
            linear-gradient(120deg, #fff4e3, #fef7ef 45%, #fff3f9);
        }

        .day-edit-layout {
          display: grid;
          grid-template-columns: 60% 40%;
          gap: 2rem;
          align-items: start;
        }

        .day-card-preview {
          background: var(--paper);
          border: 2px solid #111;
          box-shadow: 10px 10px 0 #111;
          padding: 2rem;
          min-height: 380px;
          display: grid;
          place-items: center;
          text-align: center;
        }

        .preview-card {
          width: min(520px, 100%);
          border: 2px solid #111;
          box-shadow: 10px 10px 0 #111;
          border-radius: 18px;
          padding: 2rem;
          min-height: 320px;
          display: grid;
          gap: 0.75rem;
          align-content: center;
          background: #fff;
        }

        .photo-preview {
          width: 100%;
          border-radius: 16px;
          border: 2px solid #111;
          object-fit: contain;
          max-height: 280px;
          background: #fff;
        }

        .panel {
          background: #fff;
          border: 1px solid #111;
          padding: 1.5rem;
          box-shadow: 6px 6px 0 #111;
          display: grid;
          gap: 1.25rem;
        }

        .panel label {
          display: block;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 0.4rem;
        }

        .panel select {
          width: 100%;
          padding: 0.6rem 0.8rem;
          border: 1px solid #111;
          background: #fff;
          font-size: 0.9rem;
          border-radius: 12px;
        }

        .panel input[type="file"] {
          width: 100%;
          font-size: 1rem;
        }

        .color-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .color-swatch {
          width: 32px;
          height: 32px;
          border-radius: 999px;
          border: 1px solid #111;
          cursor: pointer;
          padding: 0;
          background: transparent;
        }
      `}</style>

      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: '"hagrid", "sofia-pro", sans-serif', margin: 0 }}>
            Edit Day {dayNumber}: {genreLabel}
          </h1>
          <p style={{ margin: '0.4rem 0 0' }}>Your changes autosave.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span
            style={{
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '0.35rem 0.7rem',
              border: '1px solid #111',
              borderRadius: '999px',
              background: 'rgba(255,255,255,0.7)',
            }}
          >
            {saveStatus === 'saving'
              ? 'Saving…'
              : saveStatus === 'saved'
              ? 'Saved ✓'
              : saveStatus === 'error'
              ? 'Save failed'
              : 'Idle'}
          </span>

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
      </div>

      <div className="day-edit-layout">
        <div className="day-card-preview">
          <div className="preview-card" style={{ fontFamily: font, background: cardColor }}>
            <p style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              Day {dayNumber}
            </p>
            <h2 style={{ margin: 0, fontSize: '1rem' }}>{genreLabel}</h2>
            {photoData ? (
              <img className="photo-preview" src={photoData} alt="Day 2 upload preview" />
            ) : (
              <p style={{ margin: '0.5rem 0 0' }}>Upload a photo to preview it here.</p>
            )}
          </div>
        </div>

        <aside className="panel">
          <div>
            <label>Card Color</label>
            <div className="color-row">
              {colorOptions.map(color => (
                <button
                  key={color}
                  type="button"
                  className="color-swatch"
                  onClick={() => updateDay({ cardColor: color })}
                  style={{
                    background: color,
                    outline: cardColor === color ? '2px solid #111' : 'none',
                  }}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>

          <div>
            <label>Card Font</label>
            <select value={font} onChange={event => updateDay({ font: event.target.value })}>
              {fonts.map(fontOption => (
                <option key={fontOption} value={fontOption}>
                  {fontOption}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Genre</label>
            <div style={{ fontWeight: 600 }}>{genreLabel}</div>
          </div>

          <div style={{ fontSize: '1.15rem' }}>
            <label>Upload Picture</label>
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
            <div style={{ fontSize: '0.95rem', opacity: 0.75, marginTop: 6 }}>
              The image is stored in the calendar record for Day 2.
            </div>
            {photoData && (
              <button
                type="button"
                onClick={() => updateDay({ photoData: '' })}
                style={{
                  marginTop: '0.75rem',
                  border: '1px solid #111',
                  padding: '0.5rem 0.9rem',
                  background: 'transparent',
                  cursor: 'pointer',
                }}
              >
                Remove photo
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

export default DayEditDay2
