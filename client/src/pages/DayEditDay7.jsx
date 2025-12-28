import { Link } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'
import { getCalendarById, updateCalendar } from '../api/calendars'
import BackgroundPicker, { buildPreviewStyle } from '../components/BackgroundPicker'

const fonts = ['hagrid', 'sofia-pro', 'Edu NSW ACT Cursive', 'Gill Sans', 'Georgia']
const colorOptions = ['#ffcadc', '#ffe7b3', '#cfe8ff', '#d9f0df', '#f5d2ff']
const presetImages = ['/bg1.jpg', '/bg2.jpg', '/bg3.jpg', '/bg4.jpg', '/bg5.jpg']

const DEFAULT_DAY = {
  type: 'My favorite memory of you',
  bgMode: 'color',
  cardColor: colorOptions[0],
  bgImage: '',
  font: fonts[0],
  memoryTitle: '',
  memoryReason: '',
  memoryImage: '',
  updatedAt: '',
}

function DayEditDay7() {
  const dayNumber = 7
  const dayIndex = 6
  const genreLabel = 'My favorite memory of you'
  const calendarId = useMemo(() => localStorage.getItem('currentCalendarId'), [])

  const [calendar, setCalendar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState('idle')

  const [bgMode, setBgMode] = useState('color')
  const [cardColor, setCardColor] = useState(colorOptions[0])
  const [bgImage, setBgImage] = useState('')
  const [font, setFont] = useState(fonts[0])
  const [memoryTitle, setMemoryTitle] = useState('')
  const [memoryReason, setMemoryReason] = useState('')
  const [memoryImage, setMemoryImage] = useState('')

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

  useEffect(() => {
    let alive = true

    async function load() {
      try {
        setLoading(true)
        const remote = calendarId ? await getCalendarById(calendarId) : null
        const cal = ensureCalendarShape(remote)
        if (!alive) return

        setCalendar(cal)

        const day = cal?.days?.[dayIndex] || DEFAULT_DAY
        setBgMode(day.bgMode ?? 'color')
        setCardColor(day.cardColor ?? colorOptions[0])
        setBgImage(day.bgImage ?? day.bgImageUrl ?? '')
        setFont(day.font ?? fonts[0])
        setMemoryTitle(day.memoryTitle ?? '')
        setMemoryReason(day.memoryReason ?? '')
        setMemoryImage(day.memoryImage ?? '')
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

  const previewStyle = useMemo(
    () => buildPreviewStyle({ bgMode, bgImage, cardColor }),
    [bgMode, bgImage, cardColor]
  )

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
    if ('bgMode' in patch) setBgMode(patch.bgMode)
    if ('cardColor' in patch) setCardColor(patch.cardColor)
    if ('bgImage' in patch) setBgImage(patch.bgImage)
    if ('font' in patch) setFont(patch.font)
    if ('memoryTitle' in patch) setMemoryTitle(patch.memoryTitle)
    if ('memoryReason' in patch) setMemoryReason(patch.memoryReason)
    if ('memoryImage' in patch) setMemoryImage(patch.memoryImage)

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
        bgMode: patch.bgMode ?? bgMode,
        cardColor: patch.cardColor ?? cardColor,
        bgImage: patch.bgImage ?? bgImage,
        font: patch.font ?? font,
        memoryTitle: patch.memoryTitle ?? memoryTitle,
        memoryReason: patch.memoryReason ?? memoryReason,
        memoryImage: patch.memoryImage ?? memoryImage,
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

  function handleMemoryUpload(event) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      updateDay({ memoryImage: result })
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
    return <div style={{ padding: '3rem' }}>Loading Day 7…</div>
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
          min-height: 320px;
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
          gap: 0.9rem;
          align-content: center;
          text-align: center;
        }

        .memory-preview {
          width: min(320px, 100%);
          margin: 0 auto;
          border-radius: 16px;
          border: 2px solid #111;
          box-shadow: 6px 6px 0 #111;
          overflow: hidden;
          background: #fff;
        }

        .memory-preview img {
          width: 100%;
          height: 210px;
          object-fit: cover;
          display: block;
        }

        .memory-placeholder {
          height: 210px;
          display: grid;
          place-items: center;
          background: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
          border-bottom: 2px solid #111;
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

        .panel input[type="text"],
        .panel select,
        .panel textarea,
        .panel input[type="file"] {
          width: 100%;
          padding: 0.65rem 0.85rem;
          border: 1px solid #111;
          background: #fff;
          font-size: 0.95rem;
          border-radius: 12px;
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

        .pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          border: 1px solid #111;
          border-radius: 999px;
          padding: 0.35rem 0.7rem;
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: rgba(255,255,255,0.7);
        }

        .file-input::file-selector-button {
          margin-right: 0.75rem;
          border: 1px solid #111;
          background: #fff;
          padding: 0.4rem 0.7rem;
          border-radius: 999px;
          font-size: 0.8rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
        }
      `}</style>

      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: '"hagrid", "sofia-pro", sans-serif', margin: 0 }}>
            Edit Day {dayNumber}: {genreLabel}
          </h1>
          <p style={{ margin: '0.4rem 0 0' }}>Share a memory you love about them.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="pill">
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
          <div className="preview-card" style={{ ...previewStyle, fontFamily: font }}>
            <p style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              Day {dayNumber}
            </p>
            <h2 style={{ margin: 0, fontSize: '1.1rem' }}>
              {memoryTitle || 'A favorite memory'}
            </h2>
            {memoryImage && (
              <div className="memory-preview">
                <img src={memoryImage} alt={memoryTitle || 'Memory'} />
              </div>
            )}
            <p style={{ margin: 0, fontSize: '0.95rem' }}>
              {memoryReason || 'Tell them why this memory matters.'}
            </p>
          </div>
        </div>

        <aside className="panel">
          <div>
            <BackgroundPicker
              bgMode={bgMode}
              cardColor={cardColor}
              bgImage={bgImage}
              colorOptions={colorOptions}
              presetImages={presetImages}
              onChange={updateDay}
            />
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
            <label>Favorite Memory</label>
            <input
              type="text"
              placeholder="Ex: Our late-night diner run"
              value={memoryTitle}
              onChange={event => updateDay({ memoryTitle: event.target.value })}
            />
          </div>

          <div>
            <label>Why It's a Favorite</label>
            <input
              type="text"
              placeholder="Ex: We laughed for hours and forgot the time"
              value={memoryReason}
              onChange={event => updateDay({ memoryReason: event.target.value })}
            />
          </div>

          <div>
            <label>Optional Photo</label>
            <input
              className="file-input"
              type="file"
              accept="image/*"
              onChange={handleMemoryUpload}
            />
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

export default DayEditDay7
