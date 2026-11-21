import { useState } from 'react'
import { loginUser } from '../services/api'
import { useNavigate } from 'react-router-dom'
import './Login.css'

function Login({ onLogin }) {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('username')
    console.log('Logged out')
  }

  const handleLogin = () => {
    setMessage('')

    loginUser(username, password).then(data => {
      console.log('Login response:', JSON.stringify(data))

      if (data.access) {
        localStorage.setItem('accessToken', data.access)
        localStorage.setItem('refreshToken', data.refresh)
        localStorage.setItem('username', username)

        console.log('Access token saved')

        onLogin()
        navigate('/')
      } else {
        setMessage('Invalid username or password.')
      }
    })
  }

  return (
    <div className="login-form">
      <h2 className="login-title">Login</h2>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {message && (
        <p className="login-error">
          {message}
        </p>
      )}

      <button
        className="login-submit"
        onClick={handleLogin}
      >
        Login
      </button>

      <button
        className="logout-button"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  )
}

export default Login