import { Link } from 'react-router-dom'
import './Header.css'

function Header({ cartCount, isLoggedIn, onLogin, onLogout }) {
  return (
    <header className="header">
      <div className="header-container">

        <Link to="/" className="logo">
          🍴 FoodExpress
        </Link>

        <nav className="main-nav">
          <Link to="/">Home</Link>
          <Link to="/menu">Menu</Link>
          <Link to="/cart">Cart ({cartCount})</Link>
           
          {!isLoggedIn ? (
        <>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
       </>
       ) : (
       <>
    <Link to="/account">Account</Link>
     
  </>
)}
        </nav>

      </div>
    </header>
  )
}

export default Header