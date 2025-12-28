import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'


function LandingCreate() {
  const user = JSON.parse(localStorage.getItem('authUser') || 'null')
  const lastAction = localStorage.getItem('authLastAction')
  const [showDashboard, setShowDashboard] = useState(lastAction !== 'login')
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await fetch('http://localhost:4000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } finally {
      localStorage.removeItem('authUser')
      localStorage.removeItem('authLastAction')
      localStorage.removeItem('authToken')
      navigate('/login')
    }
  }
  const displayName = user?.username || user?.name || 'there'
  const initial = displayName.trim().charAt(0).toUpperCase() || 'A'

  return (
    <div
      className="landing-shell gradient-bg"
      style={{
        '--ink': '#201914',
        '--paper': '#fff7ea',
        '--accent': '#eb8bb5ff',
        '--accent-strong': '#e45695',
        '--mint': '#d9f0df',
        '--sun': '#ffe2a5',
        '--sky': '#e7dbff',
        '--rose': '#ffb5c7',
      }}
    >
      <style>{`
        .landing-shell {
          min-height: 100vh;
          padding: clamp(1.5rem, 3vw, 3.5rem);
          background:
            radial-gradient(circle at 10% 10%, var(--sun), transparent 45%),
            radial-gradient(circle at 90% 0%, #f7d2ea, transparent 55%),
            radial-gradient(circle at 90% 90%, var(--mint), transparent 50%),
            linear-gradient(120deg, #fff4e3, #fef7ef 45%, #fff3f9);
          color: var(--ink);
          font-family: "sofia-pro", "Gill Sans", sans-serif;
          position: relative;
          overflow: hidden;
        }

        .landing-layout {
          display: grid;
          grid-template-columns:  minmax(260px, 1fr)
  minmax(360px, 1.2fr);
          gap: clamp(2rem, 5vw, 5rem);
          align-items: start;
          position: relative;
          z-index: 2;
        }

        .landing-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
          position: relative;
          z-index: 2;
        }

        .left-panel {
          position: relative;
        }

      .welcome-badge {
  position: relative;       /* ⬅️ THIS IS THE KEY */
  width: min(680px, 100%);
}


        .welcome-img {
          width: 100%;
          height: auto;
          display: block;
        }

       .welcome-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding-left: 6.8rem;
  padding-top: 5.3rem;
}



        

       .welcome-text {
  font-family: "Edu NSW ACT Cursive", cursive;
  font-size: 2rem;
  margin: 0;
  color: #fff;
  line-height: 1.05;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.25);
}




        .welcome-text span {
          display: block;
        }

        .hero-copy {
  margin-top: -5rem;   /* ⬅️ moves it UP */
  margin-left: 3rem;
  font-size: clamp(1.9rem, 3.6vw, 3rem);
  font-family: "hagrid", sans-serif;
  font-weight: 300;
  line-height: 1.05;
  max-width: 26rem;
  animation: gentleFloat 3s ease-in-out infinite;
}

.hero-decor {
  margin-top: 0.8rem;       /* ⬅️ space below text */
  width: 200px;              /* small image */
  height: auto;
  opacity: 0.9;
  align-self: flex-end;   /* ⬅️ THIS moves it to the right */
}


        .hero-copy span {
          display: block;
        }

        .header-intro {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .avatar {
          width: 48px;
          height: 48px;
          border-radius: 999px;
          background: #111;
          color: #fff;
          font-weight: 700;
          display: grid;
          place-items: center;
          font-family: "hagrid", "sofia-pro", sans-serif;
          letter-spacing: 0.03em;
        }

        .header-title {
          margin: 0;
          font-size: clamp(1.75rem, 4vw, 2.6rem);
          font-family: "hagrid", "sofia-pro", sans-serif;
          line-height: 1.7;
        }

        .header-subtitle {
          margin: 0.4rem 0 0;
          font-size: 1rem;
          max-width: 34rem;
        }

        .ghost-button {
          border: 1px solid #111;
          padding: 0.65rem 1.1rem;
          background: transparent;
          text-decoration: none;
          color: inherit;
          font-size: 0.9rem;
          letter-spacing: 0.04em;
          display: inline-block;
        }

        .cta-card {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          align-items: start;
          background: var(--paper);
          padding: 2rem;
          border: 2px solid #111;
          box-shadow: 10px 10px 0 #111;
          position: relative;
          z-index: 2;
          animation: rise 0.8s ease both;
        }

        .cta-title {
          font-size: clamp(1.7rem, 3vw, 2.4rem);
          margin: 0 0 0.5rem;
          font-family: "hagrid", "sofia-pro", sans-serif;
        }

        .cta-actions {
          display: grid;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .primary-button,
        .secondary-button,
        .pill-button {
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
          transition: background 0.2s ease, color 0.2s ease;
        }

        .primary-button {
          background: var(--accent);
          color: #fff;
          border-color: var(--accent-strong);
        }

        .secondary-button {
          background: transparent;
          color: var(--ink);
        }

        .cta-card .primary-button,
        .cta-card .secondary-button {
          border-radius: 999px;
        }

        .cta-card .primary-button:hover,
        .cta-card .secondary-button:hover {
          background: linear-gradient(90deg, #ff9ac2, #fff);
          color: #111;
        }

        .calendar-section {
          margin-top: 3rem;
          position: relative;
          z-index: 2;
        }

        .welcome-card {
          margin: 6vh auto 0;
          max-width: 520px;
          background: #fff;
          border: 2px solid #111;
          padding: 2.5rem;
          text-align: center;
          box-shadow: 10px 10px 0 #111;
          animation: rise 0.8s ease both;
        }

        .section-title {
          font-size: 1.3rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin: 0 0 1.5rem;
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }

        .calendar-card {
          background: #fff;
          border: 1px solid #111;
          padding: 1.5rem;
          display: grid;
          gap: 0.85rem;
          box-shadow: 6px 6px 0 #111;
          animation: rise 0.7s ease both;
        }

        .calendar-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          font-size: 0.85rem;
        }

        .badge {
          padding: 0.2rem 0.6rem;
          border: 1px solid #111;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 0.65rem;
          background: #fff4d7;
        }

        .badge.live {
          background: #dcf7e5;
        }

        .card-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .pill-button {
          background: #111;
          color: #fff;
        }

        .pill-button.secondary {
          background: transparent;
          color: #111;
        }

        .pill-button[disabled] {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .share-note {
          font-size: 0.75rem;
          margin: 0;
          color: #6b5548;
        }

        @keyframes rise {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 720px) {
          .landing-layout {
            grid-template-columns: 1fr;
          }

          .left-panel {
            order: 2;
          }

          .landing-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .cta-card {
            grid-template-columns: 1fr;
          }

          .cta-actions {
            width: 100%;
            grid-template-columns: 1fr;
          }
        }
      `}</style>



      {!showDashboard ? (
        <section className="welcome-card">
          <div className="avatar" style={{ margin: '0 auto 1.2rem' }}>
            {initial}
          </div>
          <h1 className="header-title" style={{ marginBottom: '0.5rem' }}>
            Welcome back, {displayName}
          </h1>
          <p style={{ margin: 0 }}>
            You're signed in. When you're ready, jump into creating/editing a calender!
          </p>
          <button
            className="primary-button"
            type="button"
            style={{ marginTop: '1.5rem' }}
            onClick={() => {
              localStorage.setItem('authLastAction', 'app')
              setShowDashboard(true)
            }}
          >
            Go to your calendars
          </button>
        </section>
      ) : (
        <div className="landing-layout">
          <div
            className="left-panel"
            style={{
              flex: 1,
              padding: '3rem 4rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <div className="welcome-badge tilt-slow">
              <img src="/welcome_bg.png" alt="" className="welcome-img" />

              <div className="welcome-overlay">
                <h1 className="welcome-text">
                  <span>Welcome</span>
                  <span>{displayName}!</span>
                </h1>
              </div>
            </div>
            <div className="hero-block">
  <div className="hero-copy">
    <span>Let's build a</span>
    <span>Week Advent</span>
    <span>Calendar for</span>
    <span>someone special!</span>
  </div>
</div>

          </div>

          <div
            className="right-panel"
            style={{
              flexBasis: '40%',
              maxWidth: '50%',
              padding: '3rem 3.5rem',
              paddingRight: '5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <header className="landing-header">
              <div className="header-intro" style={{ width: '100%', justifyContent: 'flex-end', textAlign: 'right' }}>
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'flex-end' }}>
                    <p style={{ margin: 0, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                      Home Base
                    </p>
                    <div className="avatar">{initial}</div>
                  </div>
                  <h1 className="header-title">Create new/Continue Building</h1>
                  <p className="header-subtitle">
                    Draft the surprises, publish when it's ready, then share the link.
                  </p>
                </div>
              </div>
              
            </header>

            <section className="cta-card">
              <div>
                <p style={{ margin: 0 }}>
                  Plan a 7-day experience with daily reveals. Start with a draft and polish it before sharing.
                </p>
              </div>
              <div className="cta-actions">
                <Link className="primary-button" to="/app/create">
                  Create a new Advent Calendar
                </Link>
                <Link className="secondary-button" to="/app/calendars">
                  Your Calendars
                </Link>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={handleLogout}
                >
                  Sign out
                </button>
              </div>
              
            </section>
            <img
    src="/pink_heart.png"
    alt=""
    className="hero-decor tilt-fast"
  />

          </div>
        </div>
      )}
    </div>
  )
}

export default LandingCreate
