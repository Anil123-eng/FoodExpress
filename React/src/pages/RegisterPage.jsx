
import { useState } from 'react'
import { registerUser } from '../services/api'
import { Link, useNavigate } from 'react-router-dom'
import './RegisterPage.css'

function Register() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleRegister = () => {
    setMessage('')

    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      setMessage('Please fill in all fields.')
      return
    }

    if (password.length < 8) {
      setMessage('Password must be at least 8 characters long.')
      return
    }

    if (!/[A-Z]/.test(password)) {
      setMessage('Password must contain at least one uppercase letter.')
      return
    }

    if (!/[0-9]/.test(password)) {
      setMessage('Password must contain at least one number.')
      return
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      setMessage('Password must contain at least one special character.')
      return
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    registerUser(username.trim(), email.trim(), password)
      .then((data) => {
        console.log('Register response:', JSON.stringify(data))

        if (
          data.message ||
          (typeof data.username === 'string' &&
            typeof data.email === 'string')
        ) {
          setMessage('Registration successful!')

          setUsername('')
          setEmail('')
          setPassword('')
          setConfirmPassword('')

          setTimeout(() => {
            navigate('/login')
          }, 1500)

          return
        }

        if (data.email) {
          setMessage(
            Array.isArray(data.email)
              ? data.email[0]
              : 'Email registration failed.'
          )
          return
        }

        if (data.username) {
          setMessage(
            Array.isArray(data.username)
              ? data.username[0]
              : 'Username registration failed.'
          )
          return
        }

        if (data.password) {
          setMessage(
            Array.isArray(data.password)
              ? data.password[0]
              : 'Password registration failed.'
          )
          return
        }

        setMessage(
          data.detail ||
            data.non_field_errors?.[0] ||
            'Registration failed. Please try again.'
        )
      })
      .catch((error) => {
        console.error('Registration error:', error)
        setMessage('Unable to connect to the server. Please try again.')
      })
  }

  return (
    <section className="register-page">
      <h2>Register</h2>

      <input
        type="text"
        placeholder="Username *"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Email *"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <div className="password-input-wrapper">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password *"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? '🙈' : '👁️'}
        </button>
      </div>

      <div className="password-input-wrapper">
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Confirm Password *"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          aria-label={
            showConfirmPassword ? 'Hide password' : 'Show password'
          }
        >
          {showConfirmPassword ? '🙈' : '👁️'}
        </button>
      </div>

      

      {message && (
        <p
          className={`register-message ${
            message.toLowerCase().includes('successful')
              ? 'success'
              : 'error'
          }`}
          role="status"
        >
          {message}
        </p>
      )}

      <button type="button" onClick={handleRegister}>
        Register
      </button>

      <p className="register-login-text">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </section>
  )
}

export default Register
