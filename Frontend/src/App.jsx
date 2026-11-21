import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'

import { getCartItems, refreshAccessToken } from './services/api'

import Header from './components/Header'
import MobileNav from './components/MobileNav'
import Home from './pages/Home'
import Login from './pages/LoginPage'
import Register from './pages/RegisterPage'
import Menu from './pages/MenuPage'
import Cart from './pages/CartPage'
import Checkout from './pages/CheckoutPage'
import './App.css'
import Account from './pages/AccountPage'
import OrderHistory from './pages/OrderHistoryPage'



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem('accessToken')
  )
    useEffect(() => {
    const refreshToken = localStorage.getItem('refreshToken')

    if (!refreshToken) {
      return
    }

    refreshAccessToken().then(data => {
      if (data.access) {
        localStorage.setItem('accessToken', data.access)
      }
    })
  }, [])
  const [cartCount, setCartCount] = useState(0)
  useEffect(() => {
  if (!localStorage.getItem('accessToken')) {
    return
  }

  getCartItems().then(data => {
    if (Array.isArray(data)) {
      const totalQuantity = data.reduce(
        (total, item) => total + item.quantity,
        0
      )

      setCartCount(totalQuantity)
    }
  })
}, [])
  return (
    <BrowserRouter>
      <Header
          cartCount={cartCount}
          isLoggedIn={isLoggedIn}
          onLogin={() => setIsLoggedIn(true)}
          onLogout={() => setIsLoggedIn(false)}
        />
      
      <MobileNav cartCount={cartCount} />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login"
        element={<Login onLogin={() => setIsLoggedIn(true)} />}
          />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={
           <Account onLogout={() => setCartCount(0)} />
            }/>
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/menu" element={<Menu onCartUpdated={() => {
          getCartItems().then(data => {
          if (Array.isArray(data)) {
          const totalQuantity = data.reduce(
          (total, item) => total + item.quantity,0 )

          setCartCount(totalQuantity)
          }
         })
         }} />} />
        <Route path="/cart" element={<Cart onCartUpdated={() => {
          getCartItems().then(data => {
          if (Array.isArray(data)) {
             const totalQuantity = data.reduce(
              (total, item) => total + item.quantity, 0 )

            setCartCount(totalQuantity)
            }
            })
            }} />} />
        <Route
  path="/checkout"
  element={
    <Checkout
      onCartUpdated={() => {
        getCartItems().then(data => {
          if (Array.isArray(data)) {
            const totalQuantity = data.reduce(
              (total, item) => total + item.quantity,
              0
            )
            setCartCount(totalQuantity)
           } else {
             setCartCount(0)
           }
         })
       }}
     />
     }
   />
      </Routes>
    </BrowserRouter>
  )
}

export default App