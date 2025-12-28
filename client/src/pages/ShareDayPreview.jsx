import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { getSharedCalendar } from '../api/calendars'
import { buildPreviewStyle } from '../components/BackgroundPicker'
import RevealEffectOverlay from '../components/RevealEffectOverlay'

const fallbackDay = {
  dayNumber: 1,
  type: 'Message',
  cardColor: '#ffcadc',
  bgMode: 'color',
  bgImage: '',
  font: 'hagrid',
  message: '',
}

function ShareDayPreview() {
  const { shareToken, dayId } = useParams()
  const location = useLocation()
  const dayNumber = useMemo(() => Number(dayId) || 1, [dayId])
  const query = useMemo(() => new URLSearchParams(location.search), [location.search])
  const ownerCalendarId = query.get('calendarId')
  const isOwnerPreview = query.get('owner') === '1' && ownerCalendarId
  const cardRef = useRef(null)
  const triggerKey = `${shareToken || 'share'}:${dayNumber}`
  const [dayData, setDayData] = useState(fallbackDay)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true

    async function load() {
      try {
        setLoading(true)
        const calendar = shareToken ? await getSharedCalendar(shareToken) : null
        if (!alive) return

        const dayIndex = Math.max(0, dayNumber - 1)
        const day = calendar?.days?.[dayIndex] || fallbackDay
        setDayData({
          ...fallbackDay,
          ...day,
          bgImage: day?.bgImage ?? day?.bgImageUrl ?? '',
          dayNumber,
        })
        setError('')
      } catch (err) {
        if (!alive) return
        setDayData({ ...fallbackDay, dayNumber })
        setError('This day is not available.')
      } finally {
        if (alive) setLoading(false)
      }
    }

    load()
    return () => {
      alive = false
    }
  }, [dayNumber, shareToken])

  const previewStyle = useMemo(
    () =>
      buildPreviewStyle({
        bgMode: dayData.bgMode,
        bgImage: dayData.bgImage,
        cardColor: dayData.cardColor,
      }),
    [dayData]
  )

  const typeLabel = (dayData.type || '').toLowerCase()
  const isSongDay = typeLabel.includes('song')
  const isBookDay = typeLabel.includes('book')
  const isFlowerDay = typeLabel.includes('flower')
  const isProductDay = typeLabel.includes('product')
  const isMemoryDay = typeLabel.includes('memory')
  const hasPhoto = Boolean(dayData.photoData)

  if (loading) {
    return <div style={{ padding: '3rem' }}>Loading day…</div>
  }

  if (error) {
    return (
      <div style={{ padding: '3rem' }}>
        <p>{error}</p>
        <Link to={isOwnerPreview ? `/app/calendar/${ownerCalendarId}/share` : `/share/${shareToken}`}>
          Back to calendar
        </Link>
      </div>
    )
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
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <img
        src="/gift.png"
        alt=""
        className="tilt"
        style={{
          position: 'absolute',
          top: '16%',
          left: '13%',
          width: '12%',
          opacity: 1,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <img
        src="/pink_bow.png"
        alt=""
        className="tilt"
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '8.5%',
          width: '260px',
          opacity: 0.9,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <img
        src="/star.png"
        alt=""
        className="tilt-fast"
        style={{
          position: 'absolute',
          top: '13.5%',
          right: '11%',
          width: '11%',
          opacity: 1,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <img
        src="/glass_heart.png"
        alt=""
        className="tilt"
        style={{
          position: 'absolute',
          bottom: '5rem',
          right: '12%',
          width: '160px',
          opacity: 0.9,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
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
          margin: 6rem auto 0;
        }

        .preview-card {
          border: 2px solid #111;
          box-shadow: 10px 10px 0 #111;
          border-radius: 18px;
          padding: 2rem;
          min-height: 320px;
          display: grid;
          gap: 0.85rem;
          align-content: center;
          text-align: center;
        }

        .preview-card.book-preview {
          border: 2px solid #fff;
          box-shadow: 0 0 18px rgba(255, 255, 255, 0.85);
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

        .preview-song {
          display: grid;
          gap: 0.6rem;
          place-items: center;
        }

        .preview-song-title {
          font-size: clamp(1.2rem, 2vw, 1.6rem);
          font-weight: 700;
        }

        .preview-song-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.45rem 0.85rem;
          border: 1px solid #111;
          border-radius: 999px;
          text-decoration: none;
          color: inherit;
          background: rgba(255, 255, 255, 0.85);
        }

        .preview-book {
          display: grid;
          gap: 0.6rem;
          place-items: center;
        }

        .preview-book-title {
          font-size: clamp(1.1rem, 2.1vw, 1.5rem);
          font-weight: 700;
        }

        .book-outline {
          -webkit-text-stroke: 1.2px #fff;
          paint-order: stroke fill;
          text-shadow:
            0 0 4px rgba(255, 255, 255, 0.85),
            0 0 10px rgba(255, 255, 255, 0.85);
        }

        .preview-book-cover {
          width: min(220px, 70%);
          border-radius: 14px;
          border: 2px solid #111;
          object-fit: contain;
          background: #fff;
        }

        .preview-flower {
          display: grid;
          gap: 0.75rem;
          place-items: center;
        }

        .preview-flower-image {
          width: min(360px, 100%);
          height: 280px;
          object-fit: cover;
          border-radius: 16px;
          border: 2px solid #111;
          box-shadow: 6px 6px 0 #111;
          background: #fff;
        }

        .preview-flower-message {
          max-width: 420px;
        }

        .preview-product {
          display: grid;
          gap: 0.85rem;
          place-items: center;
        }

        .preview-product-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.55rem 1rem;
          border: 1px solid #111;
          border-radius: 999px;
          text-decoration: none;
          color: inherit;
          background: rgba(255, 255, 255, 0.9);
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .preview-product-message {
          max-width: 420px;
        }

        .preview-memory {
          display: grid;
          gap: 0.85rem;
          place-items: center;
        }

        .preview-memory-image {
          width: min(420px, 100%);
          max-height: 280px;
          object-fit: cover;
          border-radius: 18px;
          border: 2px solid #111;
          box-shadow: 6px 6px 0 #111;
          background: #fff;
        }

        .preview-memory-text {
          max-width: 460px;
        }

        .preview-image {
          width: 100%;
          max-height: 320px;
          object-fit: contain;
          border-radius: 16px;
          border: 2px solid #111;
          background: #fff;
        }

        .song-outline {
          -webkit-text-stroke: 1.2px #fff;
          paint-order: stroke fill;
          text-shadow:
            0 0 4px rgba(255, 255, 255, 0.85),
            0 0 10px rgba(255, 255, 255, 0.85);
        }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontFamily: '"hagrid", "sofia-pro", sans-serif', margin: 0 }}>
          Day {dayNumber}
        </h1>
        <Link
          to={isOwnerPreview ? `/app/calendar/${ownerCalendarId}/share` : `/share/${shareToken}`}
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
          Back to calendar
        </Link>
      </div>

      <RevealEffectOverlay triggerKey={triggerKey} anchorRef={cardRef} disabled={isOwnerPreview} />

      <div className="preview-frame">
        <div
          ref={cardRef}
          className={`preview-card${isBookDay ? ' book-preview' : ''}`}
          style={{ ...previewStyle, fontFamily: dayData.font || 'hagrid', position: 'relative', zIndex: 1 }}
        >
          <p
            className={isSongDay ? 'song-outline' : isBookDay ? 'book-outline' : undefined}
            style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.2em' }}
          >
            Day {dayNumber}
          </p>
          <h2
            className={isSongDay ? 'song-outline' : isBookDay ? 'book-outline' : undefined}
            style={{ margin: 0, fontSize: '1rem' }}
          >
            {dayData.type || 'Message'}
          </h2>
          {isSongDay ? (
            <div className="preview-song">
              <div className="preview-song-title song-outline">
                {dayData.songTitle?.trim() ? dayData.songTitle : 'Song title'}
              </div>
              <div className="song-outline" style={{ fontSize: '1rem', fontWeight: 600 }}>
                {dayData.artist?.trim() ? `by ${dayData.artist}` : 'by Artist'}
              </div>
              {dayData.songUrl?.trim() ? (
                <a
                  className="preview-song-link song-outline"
                  href={dayData.songUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Listen to the song
                </a>
              ) : null}
            </div>
          ) : isBookDay ? (
            <div className="preview-book">
              {dayData.coverData ? (
                <img
                  className="preview-book-cover"
                  src={dayData.coverData}
                  alt={`Day ${dayNumber} book cover`}
                />
              ) : null}
              {dayData.bookTitle?.trim() ? (
                <div className="preview-book-title book-outline">{dayData.bookTitle}</div>
              ) : null}
              {dayData.author?.trim() ? (
                <div className="book-outline" style={{ fontSize: '1rem', fontWeight: 600 }}>
                  by {dayData.author}
                </div>
              ) : null}
              {dayData.recommendation?.trim() ? (
                <p className="book-outline" style={{ margin: 0, fontSize: '0.95rem' }}>
                  {dayData.recommendation}
                </p>
              ) : null}
            </div>
          ) : isFlowerDay ? (
            <div className="preview-flower">
              {dayData.flowerImage?.trim() ? (
                <img
                  className="preview-flower-image"
                  src={dayData.flowerImage}
                  alt={dayData.flowerName || `Day ${dayNumber} flowers`}
                />
              ) : null}
              {dayData.flowerName?.trim() ? (
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                  {dayData.flowerName}
                </div>
              ) : null}
              {dayData.message?.trim() ? (
                <p className="preview-flower-message" style={{ margin: 0, fontSize: '0.95rem' }}>
                  {dayData.message}
                </p>
              ) : null}
            </div>
          ) : isProductDay ? (
            <div className="preview-product">
              {dayData.productLink?.trim() ? (
                <a
                  className="preview-product-link"
                  href={dayData.productLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  View product
                </a>
              ) : null}
              {dayData.message?.trim() ? (
                <p className="preview-product-message" style={{ margin: 0, fontSize: '0.95rem' }}>
                  {dayData.message}
                </p>
              ) : null}
            </div>
          ) : isMemoryDay ? (
            <div className="preview-memory">
              {dayData.memoryImage?.trim() ? (
                <img
                  className="preview-memory-image"
                  src={dayData.memoryImage}
                  alt={dayData.memoryTitle || `Day ${dayNumber} memory`}
                />
              ) : null}
              {dayData.memoryTitle?.trim() ? (
                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                  {dayData.memoryTitle}
                </div>
              ) : null}
              {dayData.memoryReason?.trim() ? (
                <p className="preview-memory-text" style={{ margin: 0, fontSize: '0.95rem' }}>
                  {dayData.memoryReason}
                </p>
              ) : null}
            </div>
          ) : hasPhoto ? (
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

export default ShareDayPreview
