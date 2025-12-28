import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout.jsx'

function Signup() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const res = await fetch(`${apiBase}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.message || 'Signup failed')
      if (data.user) {
        localStorage.setItem('authUser', JSON.stringify(data.user))
        localStorage.setItem('authLastAction', 'login')
      }
      navigate('/app')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout mode="signup">
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
        <div>
          <label className="auth-label">Username</label>
          <input
            className="auth-input"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="auth-label">Password</label>
          <input
            className="auth-input"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="auth-error">{error}</p>}

        <button
          style={{
            padding: '0.8rem',
            background: '#000',
            color: '#fff',
            border: 'none',
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing up...' : 'Sign up'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default Signup
