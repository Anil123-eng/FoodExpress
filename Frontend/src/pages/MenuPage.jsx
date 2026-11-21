import MenuItems from '../components/Menu'

function Menu({ onCartUpdated }) {
  return (
    <main className="menu-page">
      <MenuItems onCartUpdated={onCartUpdated} />
    </main>
  )
}

export default Menu