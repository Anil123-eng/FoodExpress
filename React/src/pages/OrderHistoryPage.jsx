import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getOrders } from '../services/api'
import './OrderHistoryPage.css'

function OrderHistory() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  

  useEffect(() => {
    getOrders().then(data => {
      if (Array.isArray(data)) {
        setOrders(data)
      }
    })
  }, [])

  return (
    <section className="page-container">
      <h2 className="order-history-title">Order History</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map(order => (
          <div className="order-history-item" key={order.id}>
            <h3>Order #{order.id}</h3>
            <p>Total: ₹{order.total_amount}</p>
            <p>Status: {order.status}</p>
            <p>
               Date: {new Date(order.created_at).toLocaleString('en-IN', {
               dateStyle: 'medium',
                timeStyle: 'short'
               })}
            </p>
            <h4>Items:</h4>

             {order.items.map(item => (
              <div className="order-history-product" key={item.id}>

              <img
                src={item.menu_item_image}
                alt={item.menu_item_name}
                className="order-history-image"
                onClick={() => navigate(`/menu?item=${item.menu_item}`)}
              />

              <p className="order-history-product-link" >
              
                
                 {item.menu_item_name} × {item.quantity} — ₹{item.price}
                 
              </p>

            </div>
              ))}
          </div>
        ))
      )}
    </section>
  )
}

export default OrderHistory