import { Link } from 'react-router-dom'

const fonts = ['hagrid', 'sofia-pro', 'Edu NSW ACT Cursive', 'Gill Sans', 'Georgia']
const colorOptions = ['#ffcadc', '#ffe7b3', '#cfe8ff', '#d9f0df', '#f5d2ff']

function DayEditDay3() {
  const dayNumber = 3
  const genreLabel = 'Special Song'

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
          grid-template-columns: minmax(280px, 1fr) minmax(280px, 360px);
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

        .day-card-preview h2 {
          margin: 0;
          font-family: "hagrid", "sofia-pro", sans-serif;
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
        }
      `}</style>

      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontFamily: '"hagrid", "sofia-pro", sans-serif', margin: 0 }}>
            Edit Day {dayNumber}: {genreLabel}
          </h1>
          <p style={{ margin: '0.4rem 0 0' }}>Design the card for this day.</p>
        </div>
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

      <div className="day-edit-layout">
        <div className="day-card-preview">
          <div>
            <p style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Preview</p>
            <h2>Day {dayNumber} Card</h2>
            <p style={{ margin: '0.5rem 0 0' }}>{genreLabel}</p>
            <p style={{ margin: '0.5rem 0 0' }}>Your design will appear here.</p>
          </div>
        </div>

        <aside className="panel">
          <div>
            <label>Card Color</label>
            <div className="color-row">
              {colorOptions.map(color => (
                <div className="color-swatch" key={color} style={{ background: color }} />
              ))}
            </div>
          </div>

          <div>
            <label>Card Font</label>
            <select defaultValue={fonts[0]}>
              {fonts.map(font => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
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

export default DayEditDay3
