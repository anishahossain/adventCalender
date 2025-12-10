function LandingPage() {
  const user = JSON.parse(localStorage.getItem('authUser') || 'null')

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Landing Page</h1>
      <p>This will later show your calendars.</p>
      {user && <p>Logged in as <strong>{user.name}</strong></p>}
    </div>
  )
}

export default LandingPage
