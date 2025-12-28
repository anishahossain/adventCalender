import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  getCalendarById,
  publishCalendarShare,
  regenerateCalendarShare,
  unpublishCalendarShare,
} from '../api/calendars'

const fallbackDays = Array.from({ length: 7 }, (_, index) => ({
  id: index + 1,
  title: `Day ${index + 1}`,
  type: 'Message',
}))

function ShareCalendarPage() {
  const { id } = useParams()
  const [calendar, setCalendar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionError, setActionError] = useState('')
  const [actionStatus, setActionStatus] = useState('')

  useEffect(() => {
    if (!id) return
    let alive = true

    async function loadCalendar() {
      try {
        setLoading(true)
        const data = await getCalendarById(id)
        if (!alive) return
        setCalendar(data)
      } catch (err) {
        if (!alive) return
        setCalendar(null)
      } finally {
        if (alive) setLoading(false)
      }
    }

    loadCalendar()
    return () => {
      alive = false
    }
  }, [id])

  const isPublished = useMemo(() => {
    if (!calendar) return false
    return Boolean(calendar.isPublished || (calendar.status || '').toLowerCase() === 'published')
  }, [calendar])

  const shareLink = useMemo(() => {
    if (!calendar?.shareToken) return ''
    return `${window.location.origin}/share/${calendar.shareToken}`
  }, [calendar])

  const previewDays = useMemo(() => {
    const days = Array.isArray(calendar?.days) && calendar.days.length ? calendar.days : fallbackDays
    return days.map((day, index) => ({
      id: index + 1,
      title: day?.title || `Day ${index + 1}`,
      type: day?.type || 'Message',
    }))
  }, [calendar])

  async function handlePublish() {
    if (!id) return
    setActionStatus('publishing')
    setActionError('')
    try {
      const updated = await publishCalendarShare(id)
      setCalendar(updated)
    } catch (err) {
      setActionError(err.message || 'Unable to publish calendar.')
    } finally {
      setActionStatus('')
    }
  }

  async function handleUnpublish() {
    if (!id) return
    setActionStatus('unpublishing')
    setActionError('')
    try {
      const updated = await unpublishCalendarShare(id)
      setCalendar(updated)
    } catch (err) {
      setActionError(err.message || 'Unable to unpublish calendar.')
    } finally {
      setActionStatus('')
    }
  }

  async function handleRegenerate() {
    if (!id) return
    setActionStatus('regenerating')
    setActionError('')
    try {
      const updated = await regenerateCalendarShare(id)
      setCalendar(updated)
    } catch (err) {
      setActionError(err.message || 'Unable to regenerate link.')
    } finally {
      setActionStatus('')
    }
  }

  async function handleCopy() {
    if (!shareLink) return
    setActionStatus('copying')
    setActionError('')
    try {
      await navigator.clipboard.writeText(shareLink)
      setActionStatus('copied')
      setTimeout(() => setActionStatus(''), 1500)
    } catch (err) {
      setActionError('Copy failed. Select the link and copy it manually.')
      setActionStatus('')
    }
  }

  if (loading) {
    return <div style={{ padding: '3rem' }}>Loading share view…</div>
  }

  if (!calendar) {
    return (
      <div style={{ padding: '3rem' }}>
        <p>Calendar not found.</p>
        <Link to="/app/calendars">Back to your calendars</Link>
      </div>
    )
  }

  return (
    <div
      className="share-shell gradient-bg"
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
        .share-shell {
          color: var(--ink);
          background:
            radial-gradient(circle at 10% 10%, #ffe2a5, transparent 45%),
            radial-gradient(circle at 90% 0%, #f7d2ea, transparent 55%),
            radial-gradient(circle at 90% 90%, #d9f0df, transparent 50%),
            linear-gradient(120deg, #fff4e3, #fef7ef 45%, #fff3f9);
        }

        .share-card {
          background: #fff;
          border: 2px solid #111;
          box-shadow: 10px 10px 0 #111;
          padding: 2rem;
          max-width: 880px;
          margin: 0 auto;
          display: grid;
          gap: 1.2rem;
        }

        .share-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .share-button {
          padding: 0.65rem 1.2rem;
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

        .share-button.secondary {
          background: transparent;
          color: #111;
        }

        .share-button:hover {
          background: linear-gradient(90deg, #ff9ac2, #fff);
          color: #111;
        }

        .share-link {
          width: 100%;
          padding: 0.7rem 1rem;
          border: 1px solid #111;
          font-size: 0.9rem;
          background: #fffdf8;
        }

        .preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .preview-card {
          border: 1px solid #111;
          padding: 1rem;
          background: #fff;
          display: grid;
          gap: 0.5rem;
        }
      `}</style>

      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: '"hagrid", "sofia-pro", sans-serif', margin: 0 }}>
            Complete & Share
          </h1>
          <p style={{ margin: '0.4rem 0 0', fontSize: '1.2rem' }}>
            {calendar.name || 'Untitled Calendar'}
          </p>
          <p style={{ margin: '0.3rem 0 0', fontSize: '0.85rem' }}>
            Status: {isPublished ? 'Published' : 'Draft'}
          </p>
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

      <div className="share-card">
        <h2 style={{ margin: 0 }}>Preview (what recipients see)</h2>
        <p style={{ margin: 0, color: '#6b5548' }}>
          Recipients can open each day, but cannot edit anything.
        </p>
        <div className="preview-grid">
          {previewDays.map(day => (
            <div className="preview-card" key={day.id}>
              <strong style={{ fontSize: '1rem' }}>{day.title}</strong>
              <span style={{ fontSize: '0.85rem' }}>{day.type}</span>
              {isPublished && calendar.shareToken ? (
                <Link
                  className="share-button secondary"
                  to={`/share/${calendar.shareToken}/day/${day.id}?owner=1&calendarId=${id}`}
                >
                  Open day
                </Link>
              ) : (
                <button className="share-button secondary" type="button" disabled>
                  Open day
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="share-card" style={{ marginTop: '2rem' }}>
        <h2 style={{ margin: 0 }}>Share link</h2>
        {isPublished ? (
          <>
            <input className="share-link" readOnly value={shareLink} />
            <div className="share-actions">
              <button
                className="share-button"
                type="button"
                onClick={handleCopy}
                disabled={!shareLink}
              >
                {actionStatus === 'copying' ? 'Copying...' : actionStatus === 'copied' ? 'Copied!' : 'Copy link'}
              </button>
              <button
                className="share-button secondary"
                type="button"
                onClick={handleUnpublish}
                disabled={actionStatus === 'unpublishing'}
              >
                {actionStatus === 'unpublishing' ? 'Unpublishing...' : 'Unpublish'}
              </button>
              <button
                className="share-button secondary"
                type="button"
                onClick={handleRegenerate}
                disabled={actionStatus === 'regenerating'}
              >
                {actionStatus === 'regenerating' ? 'Regenerating...' : 'Re-generate link'}
              </button>
            </div>
          </>
        ) : (
          <>
            <p style={{ margin: 0 }}>
              Publish to create a view-only link for your recipient.
            </p>
            <div className="share-actions">
              <button
                className="share-button"
                type="button"
                onClick={handlePublish}
                disabled={actionStatus === 'publishing'}
              >
                {actionStatus === 'publishing' ? 'Publishing...' : 'Publish & Create Share Link'}
              </button>
            </div>
          </>
        )}
        {actionError ? (
          <p style={{ margin: 0, color: '#b42318', fontSize: '0.85rem' }}>{actionError}</p>
        ) : null}
      </div>
    </div>
  )
}

export default ShareCalendarPage
