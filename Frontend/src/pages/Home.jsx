import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  return (
    <section className="home-page">
      <h1>Welcome to FoodExpress 🍴</h1>

      <p>
        Delicious food from Mehfil Restaurant,
        delivered with a simple ordering experience.
      </p>

      <Link to="/menu">
        <button>Explore Menu</button>
      </Link>
    </section>
  )
}

export default Home