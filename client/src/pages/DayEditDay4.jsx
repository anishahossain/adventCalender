import { Link } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'
import { getCalendarById, updateCalendar } from '../api/calendars'
import BackgroundPicker, { buildPreviewStyle } from '../components/BackgroundPicker'

const fonts = ['hagrid', 'sofia-pro', 'Edu NSW ACT Cursive', 'Gill Sans', 'Georgia']
const colorOptions = ['#ffcadc', '#ffe7b3', '#cfe8ff', '#d9f0df', '#f5d2ff']
const presetImages = ['/book1.jpg', '/book2.jpg', '/book3.jpg', '/book4.jpg', '/book5.jpg']

const DEFAULT_DAY = {
  type: 'Book rec',
  bgMode: 'color',
  cardColor: colorOptions[0],
  bgImage: '',
  font: fonts[0],
  bookTitle: '',
  author: '',
  recommendation: '',
  coverData: '',
  updatedAt: '',
}

function DayEditDay4() {
  const dayNumber = 4
  const dayIndex = 3
  const genreLabel = 'Book rec'
  const calendarId = useMemo(() => localStorage.getItem('currentCalendarId'), [])

  const [calendar, setCalendar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState('idle')

  const [cardColor, setCardColor] = useState(colorOptions[0])
  const [bgMode, setBgMode] = useState('color')
  const [bgImage, setBgImage] = useState('')
  const [font, setFont] = useState(fonts[0])
  const [bookTitle, setBookTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [recommendation, setRecommendation] = useState('')
  const [coverData, setCoverData] = useState('')

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
        setCardColor(day.cardColor ?? colorOptions[0])
        setBgMode(day.bgMode ?? 'color')
        setBgImage(day.bgImage ?? day.bgImageUrl ?? '')
        setFont(day.font ?? fonts[0])
        setBookTitle(day.bookTitle ?? '')
        setAuthor(day.author ?? '')
        setRecommendation(day.recommendation ?? '')
        setCoverData(day.coverData ?? '')
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
    if ('cardColor' in patch) setCardColor(patch.cardColor)
    if ('bgMode' in patch) setBgMode(patch.bgMode)
    if ('bgImage' in patch) setBgImage(patch.bgImage)
    if ('font' in patch) setFont(patch.font)
    if ('bookTitle' in patch) setBookTitle(patch.bookTitle)
    if ('author' in patch) setAuthor(patch.author)
    if ('recommendation' in patch) setRecommendation(patch.recommendation)
    if ('coverData' in patch) setCoverData(patch.coverData)

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
        bgMode: patch.bgMode ?? bgMode,
        bgImage: patch.bgImage ?? bgImage,
        font: patch.font ?? font,
        bookTitle: patch.bookTitle ?? bookTitle,
        author: patch.author ?? author,
        recommendation: patch.recommendation ?? recommendation,
        coverData: patch.coverData ?? coverData,
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

  const previewStyle = useMemo(
    () => buildPreviewStyle({ bgMode, bgImage, cardColor }),
    [bgMode, bgImage, cardColor]
  )

  function handleCoverChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      updateDay({ coverData: result })
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
    return <div style={{ padding: '3rem' }}>Loading Day 4…</div>
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
          border: 2px solid #fff;
          box-shadow: 0 0 18px rgba(255, 255, 255, 0.85);
          border-radius: 18px;
          padding: 2rem;
          min-height: 320px;
          display: grid;
          gap: 0.6rem;
          align-content: center;
        }

        .book-outline {
          -webkit-text-stroke: 1.2px #fff;
          paint-order: stroke fill;
          text-shadow:
            0 0 4px rgba(255, 255, 255, 0.85),
            0 0 10px rgba(255, 255, 255, 0.85);
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
        }

        .panel input[type="text"],
        .panel textarea {
          width: 100%;
          padding: 0.65rem 0.85rem;
          border: 1px solid #111;
          background: #fff;
          font-size: 0.95rem;
          border-radius: 12px;
        }

        .panel textarea {
          min-height: 120px;
          resize: vertical;
        }

        .panel input[type="file"] {
          width: 100%;
          padding: 0.65rem 0.85rem;
          border: 1px solid #111;
          background: #fff;
          font-size: 0.95rem;
          border-radius: 12px;
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

        .cover-preview {
          width: min(220px, 70%);
          border-radius: 14px;
          border: 2px solid #fff;
          object-fit: contain;
          background: #fff;
        }
      `}</style>

      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: '"hagrid", "sofia-pro", sans-serif', margin: 0 }}>
            Edit Day {dayNumber}: {genreLabel}
          </h1>
          <p style={{ margin: '0.4rem 0 0' }}>Design the card for this day.</p>
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
          <div className="preview-card" style={{ ...previewStyle, fontFamily: font }}>
            <p
              className="book-outline"
              style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.2em' }}
            >
              Day {dayNumber}
            </p>
            <h2 className="book-outline" style={{ margin: 0, fontSize: '1rem' }}>
              {genreLabel}
            </h2>
            {coverData ? (
              <img className="cover-preview" src={coverData} alt={`Day ${dayNumber} book cover`} />
            ) : null}
            {bookTitle.trim() ? (
              <div className="book-outline" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                {bookTitle}
              </div>
            ) : null}
            {author.trim() ? (
              <div className="book-outline" style={{ fontSize: '1rem' }}>
                by {author}
              </div>
            ) : null}
            {recommendation.trim() ? (
              <p className="book-outline" style={{ margin: 0, fontSize: '0.95rem' }}>
                {recommendation}
              </p>
            ) : null}
          </div>
        </div>

        <aside className="panel">
          <BackgroundPicker
            bgMode={bgMode}
            cardColor={cardColor}
            bgImage={bgImage}
            colorOptions={colorOptions}
            presetImages={presetImages}
            onChange={updateDay}
            labels={{
              background: 'Background',
              color: 'Color',
              image: 'Image',
              cardColor: 'Card Color',
              chooseImage: 'Choose a Book Backdrop',
            }}
          />

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
            <label>Book Title</label>
            <input
              type="text"
              placeholder="Ex: The Night Circus"
              value={bookTitle}
              onChange={event => updateDay({ bookTitle: event.target.value })}
            />
          </div>

          <div>
            <label>Author</label>
            <input
              type="text"
              placeholder="Ex: Erin Morgenstern"
              value={author}
              onChange={event => updateDay({ author: event.target.value })}
            />
          </div>

          <div>
            <label>Why I recommend it</label>
            <textarea
              placeholder="Share a quick reason..."
              value={recommendation}
              onChange={event => updateDay({ recommendation: event.target.value })}
            />
          </div>

          <div>
            <label>Book Cover (optional)</label>
            <input
              className="file-input"
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
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

export default DayEditDay4
