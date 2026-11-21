import { Link } from 'react-router-dom'
import './MobileNav.css'

function MobileNav({ cartCount }) {
  return (
    <nav className="mobile-nav">
      <Link to="/">
        <span>🏠</span>
        <small>Home</small>
      </Link>

      <Link to="/menu">
        <span>🍴</span>
        <small>Menu</small>
      </Link>

      <Link to="/cart">
        <span>🛒</span>
        <small>Cart ({cartCount})</small>
      </Link>

      <Link to="/account">
        <span>👤</span>
        <small>Account</small>
      </Link>
    </nav>
  )
}

export default MobileNav