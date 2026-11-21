import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import './Menu.css'

import {
  getMenuItems,
  addToCart,
  getValidAccessToken,
  placeOrder
} from '../services/api'

function Menu({ onCartUpdated }) {
  
  const [searchParams] = useSearchParams()
  const selectedItemId = searchParams.get('item')
  const [clickedItemId, setClickedItemId] = useState(null)

  const [menuItems, setMenuItems] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortOption, setSortOption] = useState('default')


  useEffect(() => {
    getMenuItems().then(data => {
      setMenuItems(data)
    })
  }, [])

  const categories = [
    'All',
    ...new Set(menuItems.map(item => item.category))
  ]

  const filteredItems = [...menuItems]
  .filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (
      selectedCategory === 'All' ||
      item.category === selectedCategory
    )
  )
  .sort((a, b) => {
    if (sortOption === 'price-low') {
      return Number(a.price) - Number(b.price)
    }
    if (sortOption === 'price-high') {
      return Number(b.price) - Number(a.price)
    }
    return 0
  })

const selectedItemIndex = filteredItems.findIndex(
  item => String(item.id) === selectedItemId
)

const orderedItems = selectedItemIndex > 0
  ? [
      filteredItems[selectedItemIndex],
      ...filteredItems.slice(0, selectedItemIndex),
      ...filteredItems.slice(selectedItemIndex + 1)
    ]
  : filteredItems

  const selectedItem = menuItems.find(
  item => String(item.id) === selectedItemId
  )

  return (
    <section className="menu">

      <h2 className="menu-title">Mehfil Restaurant</h2>

      <p className="menu-subtitle">
          Freshly prepared dishes, made just for you.
        </p>

      <input 
        type="text"
        className="menu-search"
        placeholder="Search dishes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      <div className="menu-filters"> 
      <select
        className="menu-category"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        {categories.map(category => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <select
          className="menu-sort"
          value={sortOption}
         onChange={(e) => setSortOption(e.target.value)}
         >
         <option value="default">Sort by</option>
          <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
         </select>
      </div>
      {filteredItems.length === 0 && (
        <p className="no-results">
          No food items found.
        </p>
      )}

      <div className="menu-grid">

        {orderedItems.map(item => (

          <div
  className={`menu-item ${
    String(item.id) === selectedItemId ||
    String(item.id) === clickedItemId
      ? 'selected-menu-item'
      : ''
  }`}
  key={item.id}
  onClick={() => setClickedItemId(String(item.id))}
>
              
            <img src={item.image} alt={item.name} className="menu-item-image" />

            <h3>{item.name}</h3>

            <p className="menu-item-category">
              {item.category}
            </p>

            <p>{item.description}</p>

            <p className="menu-item-price">₹{item.price}</p>

            <button
              onClick={async () => {
                const accessToken = await getValidAccessToken()

                if (!accessToken) {
                  window.location.href = '/login'
                  return
                }

                addToCart(item.id).then(data => {
                  console.log(
                    'Cart response:',
                    JSON.stringify(data)
                  )

                  if (data.id) {
                    onCartUpdated()
                  }
                })
              }}
            >
              Add to Cart
            </button>
            
            <button className="order-now-button"
    onClick={async () => {
  const accessToken = await getValidAccessToken()

  if (!accessToken) {
    window.location.href = '/login'
    return
  }

  const data = await addToCart(item.id)

  if (data.id) {
    window.location.href = '/checkout'
  }
}}>
             Order Now
           </button>

          </div>

        ))}

      </div>

    </section>
  )
}

export default Menu