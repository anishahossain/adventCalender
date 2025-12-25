import { Link } from 'react-router-dom'

function BlankPage({ title }) {
  return (
    <div style={{ minHeight: '100vh', padding: '3rem', fontFamily: '"sofia-pro", "Gill Sans", sans-serif' }}>
      <h1 style={{ fontFamily: '"hagrid", "sofia-pro", sans-serif', marginTop: 0 }}>{title}</h1>
      <p>This is a placeholder page for now.</p>
      <Link to="/app" style={{ textDecoration: 'underline' }}>
        Back to home base
      </Link>
    </div>
  )
}

export default BlankPage
