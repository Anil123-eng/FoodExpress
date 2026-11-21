import { Link } from 'react-router-dom'

import LoginForm from '../components/Login'


function Login({ onLogin }) {
     
  return (
    <section className="page-container">
      <LoginForm onLogin={onLogin} />

      <p className="login-register-text">
        New user? <Link to="/register">Register</Link>
      </p>
    </section>
  )
}

export default Login