import { useEffect, useState } from 'react'
import { getCartItems, deleteCartItem } from '../services/api'
import { useNavigate } from 'react-router-dom'
import './CartPage.css'

function Cart({ onCartUpdated }) {
  const [cartItems, setCartItems] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
  if (!localStorage.getItem('accessToken')) {
    return
  }

  getCartItems().then(data => {
      console.log('Cart items:', JSON.stringify(data))
      setCartItems(data)
    })
  }, [])

  return (
    <section className="page-container">
      <h2 className="cart-title">Cart</h2>

      {cartItems.length === 0 ? (
      <p className="empty-cart">Your cart is empty.</p>
      ) : (
        cartItems.map(item => (
          <div className="cart-item" key={item.id}>
            <img
               src={item.menu_item_image}
               alt={item.menu_item_name}
               className="cart-item-image"
               onClick={() => navigate(`/menu?item=${item.menu_item}`)}
               style={{ cursor: 'pointer' }}
             />

           <h3 onClick={() => navigate(`/menu?item=${item.menu_item}`)}
              style={{ cursor: 'pointer' }}
            >
             {item.menu_item_name}
           </h3>
            <p>Price: ₹{item.menu_item_price}</p>
            <p>Quantity: {item.quantity}</p>
            <button className="remove-button"
             onClick={() => {
             deleteCartItem(item.id).then(() => {
             setCartItems(cartItems.filter(cartItem => cartItem.id !== item.id))
             onCartUpdated()
              })
            }}>Delete</button>
            <button
             className="order-now-button"
             onClick={() => navigate('/checkout')}
             >
             Order Now
            </button>
          </div>
        ))
      )}
    </section>
  )
}

export default Cart