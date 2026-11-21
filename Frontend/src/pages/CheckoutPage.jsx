import { useEffect, useState } from 'react'
import { getCartItems, placeOrder } from '../services/api'
import './CheckoutPage.css'

function Checkout() {
  const [cartItems, setCartItems] = useState([])
  const [order, setOrder] = useState(null)

  useEffect(() => {
  if (!localStorage.getItem('accessToken')) {
    return
  }

  getCartItems().then(data => {
      if (Array.isArray(data)) {
        setCartItems(data)
      }
    })
  }, [])

  const totalAmount = cartItems.reduce(
    (total, item) =>
      total + Number(item.menu_item_price) * item.quantity,
    0
  )
  const handlePlaceOrder = () => {
  placeOrder().then(data => {
    console.log('Order response:', JSON.stringify(data))

    if (data.id) {
      setOrder(data)
      setCartItems([])
    }
  })
}

  return (
    <section className="page-container checkout-page">
      <h2 className="checkout-title">Checkout</h2>
      {order && (
        <div className="order-success">
          <h3>Order placed successfully! 🎉</h3>
          <p>Order #{order.id}</p>
          <p>Total: ₹{order.total_amount}</p>
        </div>
      )}

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map(item => (
  <div className="checkout-item" key={item.id}>

    <img
      src={item.menu_item_image}
      alt={item.menu_item_name}
      className="checkout-item-image"
    />

    <h3>{item.menu_item_name}</h3>
    <p>Price: ₹{item.menu_item_price}</p>
    <p>Quantity: {item.quantity}</p>

  </div>
))}

          <h3>Total: ₹{totalAmount}</h3>
          <button className="place-order-button" onClick={handlePlaceOrder}>Place Order
          </button>
        </>
      )}
    </section>
  )
}

export default Checkout

