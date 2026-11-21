import { useState } from 'react'
import { placeOrder } from '../services/api'
function Checkout({ cartItems, setCartItems, setCartCount }) {
  const [order, setOrder] = useState(null)
  return (
    <section className="checkout">
      <h2>Checkout</h2>
      <p>Review your order before placing it.</p>
      {cartItems.map((item, index) => (
      <div key={index}>
       <p>{item.name} — ₹{item.price}</p>
     </div>
      ))}
      <p>Total: ₹{cartItems.reduce((total, item) => total + Number(item.price), 0)}</p>
      <button className="place-order-button" onClick={() => {
        placeOrder().then(data => {
        console.log('Checkout response:', JSON.stringify(data))

        if (data.id) {
          setOrder(data)
          setCartItems([])
          setCartCount(0)} }) }}> Place Order</button>

        {order && (
            <div className="order-success">
               <h3>Order placed successfully! 🎉</h3>
               <p>Order ID: {order.id}</p>
               <p>Total: ₹{order.total_amount}</p>
               <p>Status: {order.status}</p>
            </div> 
          )}
    </section>
  )
}

export default Checkout