import { Link } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'
import { getCalendarById, updateCalendar } from '../api/calendars'

const fonts = ['hagrid', 'sofia-pro', 'Edu NSW ACT Cursive', 'Gill Sans', 'Georgia']
const colorOptions = ['#ffcadc', '#ffe7b3', '#cfe8ff', '#d9f0df', '#f5d2ff']
const presetImages = [
  '/bg1.jpg',
  '/bg2.jpg',
  '/bg3.jpg',
  '/bg4.jpg',
  '/bg5.jpg',
]

const DEFAULT_DAY = {
  type: 'Message',
  bgMode: 'color',      // 'color' | 'image'
  cardColor: colorOptions[0],
  bgImage: '',
  font: fonts[0],
  message: '',
}

function DayEditDay1() {
  const dayNumber = 1
  const dayIndex = 0
  const genreLabel = 'Message'

  const calendarId = useMemo(() => localStorage.getItem('currentCalendarId'), [])
  const [calendar, setCalendar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState('idle') // idle | saving | saved | error

  // Local Day UI state
  const [cardColor, setCardColor] = useState(colorOptions[0])
  const [bgMode, setBgMode] = useState('color')
  const [bgImage, setBgImage] = useState('')
  const [font, setFont] = useState(fonts[0])
  const [message, setMessage] = useState('')

  // Debounce + race protection
  const saveTimerRef = useRef(null)
  const lastSaveTokenRef = useRef(0)

  function ensureCalendarShape(cal) {
    if (!cal) return null
    const name = cal.name || 'Untitled Calendar'
    const description = cal.description || ''
    const type = cal.type || '7-day'
    const status = cal.status || 'draft'
    const days =
      Array.isArray(cal.days) && cal.days.length === 7
        ? cal.days
        : Array.from({ length: 7 }, () => ({ ...DEFAULT_DAY }))

    return {
      ...cal,
      name,
      description,
      type,
      status,
      days,
    }
  }

  // Load calendar on mount
  useEffect(() => {
    let alive = true

    async function load() {
      try {
        setLoading(true)

        const remote = calendarId ? await getCalendarById(calendarId) : null
        const cal = ensureCalendarShape(remote)
        if (!alive) return

        setCalendar(cal)

        // Hydrate day UI state from calendar.days[0]
        const day = cal?.days?.[dayIndex] || DEFAULT_DAY
        setCardColor(day.cardColor ?? colorOptions[0])
        setBgMode(day.bgMode ?? 'color')
        setBgImage(day.bgImage ?? day.bgImageUrl ?? '')
        setFont(day.font ?? fonts[0])
        setMessage(day.message ?? '')
      } catch (e) {
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

  // Preview style
  const previewStyle = useMemo(() => {
    const base = { background: cardColor }

    if (bgMode === 'image' && bgImage.trim()) {
      return {
        ...base,
        backgroundImage: `url(${bgImage.trim()})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    }

    return base
  }, [bgMode, bgImage, cardColor])

  // Build updated calendar with day[0] applied
  function buildNextCalendar(partialDayPatch) {
    if (!calendar) return null

    const days = Array.isArray(calendar.days) ? [...calendar.days] : Array.from({ length: 7 }, () => ({ ...DEFAULT_DAY }))
    const prevDay = days[dayIndex] || { ...DEFAULT_DAY }

    const nextDay = {
      ...prevDay,
      dayNumber,
      type: genreLabel,
      ...partialDayPatch,
      updatedAt: new Date().toISOString(),
    }

    days[dayIndex] = nextDay

    return {
      ...calendar,
      days,
      updatedAt: new Date().toISOString(),
    }
  }

  // Debounced save (PUT whole calendar)
  function scheduleSave(nextCal) {
    if (!calendarId || !nextCal) return
    const hydrated = ensureCalendarShape(nextCal)
    if (!hydrated) return

    setSaveStatus('saving')

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)

    const token = ++lastSaveTokenRef.current

    saveTimerRef.current = setTimeout(async () => {
      try {
        await updateCalendar(calendarId, hydrated)
        // ignore stale saves
        if (token !== lastSaveTokenRef.current) return
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 1200)
      } catch (e) {
        if (token !== lastSaveTokenRef.current) return
        setSaveStatus('error')
      }
    }, 900)
  }

  // Unified update function: update UI state + update calendar.days[0] + schedule PUT
  function updateDay(patch) {
    // Update local UI states (so preview updates instantly)
    if ('cardColor' in patch) setCardColor(patch.cardColor)
    if ('bgMode' in patch) setBgMode(patch.bgMode)
    if ('bgImage' in patch) setBgImage(patch.bgImage)
    if ('font' in patch) setFont(patch.font)
    if ('message' in patch) setMessage(patch.message)

    // Update full calendar state + debounce PUT
    setCalendar(prev => {
      if (!prev) return prev
      const nextCal = (() => {
        const days = Array.isArray(prev.days) ? [...prev.days] : Array.from({ length: 7 }, () => ({ ...DEFAULT_DAY }))
        const prevDay = days[dayIndex] || { ...DEFAULT_DAY }

        const nextDay = {
          ...prevDay,
          dayNumber,
          type: genreLabel,
          cardColor: patch.cardColor ?? cardColor,
          bgMode: patch.bgMode ?? bgMode,
          bgImage: patch.bgImage ?? bgImage,
          font: patch.font ?? font,
          message: patch.message ?? message,
          updatedAt: new Date().toISOString(),
        }

        days[dayIndex] = nextDay

        return {
          ...prev,
          days,
          updatedAt: new Date().toISOString(),
        }
      })()

      scheduleSave(nextCal)
      return nextCal
    })
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
    return <div style={{ padding: '3rem' }}>Loading Day 1…</div>
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
        }

        .preview-message {
          display: inline-block;
          align-self: center;
          background: rgba(255, 255, 255, 0.8);
          padding: 0.35rem 0.75rem;
          border-radius: 999px;
          border: 1px solid #111;
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

        .panel input[type="text"], .panel textarea, .panel select {
          width: 100%;
          padding: 0.65rem 0.85rem;
          border: 1px solid #111;
          background: #fff;
          font-size: 0.95rem;
          border-radius: 12px;
        }

        .panel textarea {
          min-height: 110px;
          resize: vertical;
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

        .color-swatch.active {
          outline: 3px solid #111;
          outline-offset: 2px;
        }

        .segmented {
          display: flex;
          border: 1px solid #111;
          border-radius: 999px;
          overflow: hidden;
        }

        .segmented button {
          flex: 1;
          padding: 0.55rem 0.75rem;
          border: 0;
          background: transparent;
          cursor: pointer;
          font-size: 0.85rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .segmented button.active {
          background: #111;
          color: #fff;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 0.35rem 0.7rem;
          border: 1px solid #111;
          border-radius: 999px;
          background: rgba(255,255,255,0.7);
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
          <span className="status-pill">
            {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? 'Saved ✓' : saveStatus === 'error' ? 'Save failed' : 'Idle'}
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
        {/* PREVIEW */}
        <div className="day-card-preview">
          <div className="preview-card" style={{ ...previewStyle, fontFamily: font }}>
            <p style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Day {dayNumber}</p>
            <h2 style={{ margin: 0, fontSize: '1rem' }}>A little message</h2>
            <p className="preview-message" style={{ margin: 0, fontWeight: 700, fontSize: '1.15rem' }}>
              {message.trim() ? message : 'Your message preview will appear here…'}
            </p>
          </div>
        </div>

        {/* CONTROLS */}
        <aside className="panel">
          <div>
            <label>Background</label>
            <div className="segmented">
              <button
                type="button"
                className={bgMode === 'color' ? 'active' : ''}
                onClick={() => updateDay({ bgMode: 'color' })}
              >
                Color
              </button>
              <button
                type="button"
                className={bgMode === 'image' ? 'active' : ''}
                onClick={() => updateDay({ bgMode: 'image' })}
              >
                Image
              </button>
            </div>
          </div>

          {bgMode === 'color' && (
            <div>
              <label>Card Color</label>
              <div className="color-row">
                {colorOptions.map(color => (
                  <button
                    key={color}
                    type="button"
                    className={`color-swatch ${cardColor === color ? 'active' : ''}`}
                    style={{ background: color }}
                    onClick={() => updateDay({ cardColor: color })}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>
          )}

          {bgMode === 'image' && (
            <div>
              <label>Choose a Background Image</label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.75rem',
                }}
              >
                {presetImages.map(src => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => updateDay({ bgMode: 'image', bgImage: src })}
                    style={{
                      border: bgImage === src ? '3px solid #111' : '1px solid #111',
                      borderRadius: 12,
                      padding: 0,
                      cursor: 'pointer',
                      overflow: 'hidden',
                      background: 'transparent',
                    }}
                  >
                    <img
                      src={src}
                      alt=""
                      style={{
                        width: '100%',
                        height: 80,
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label>Card Font</label>
            <select value={font} onChange={(e) => updateDay({ font: e.target.value })}>
              {fonts.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Message</label>
            <textarea
              placeholder="Write your note for Day 1…"
              value={message}
              onChange={(e) => updateDay({ message: e.target.value })}
              maxLength={200}
            />
            <div style={{ fontSize: 12, opacity: 0.75, textAlign: 'right' }}>
              {message.length}/200
            </div>
          </div>

          <div>
            <label>Genre</label>
            <div style={{ fontWeight: 600 }}>{genreLabel}</div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default DayEditDay1
