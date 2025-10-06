import { HomePage } from './pages/HomePage'
import { Routes, Route } from 'react-router'
import { CheckoutPage } from './pages/CheckoutPage'
import { OrdersPage } from './pages/OrdersPage'
import { TrackingPage } from './pages/TrackingPage'
import { Register } from './pages/Register'
import { Login } from './pages/Login'
import { useState, useEffect } from 'react'
import axios from 'axios'

import './App.css'

function App() {

  const [cartItems, setCartItems] = useState([]);

   function fetchProducts() {
  const token = localStorage.getItem('token');
  
  axios.get('http://localhost:3000/api/cartitems', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then((response) => {
    setCartItems(response.data);
  })
  .catch((error) => {
    console.error('Error fetching cart items:', error);
  });
}

  useEffect(()=> {

    fetchProducts();

  },[])

  

  return (
    <Routes>
      <Route path="/" element= {<HomePage cart = {cartItems} fetchProducts = {fetchProducts} />} />
      <Route path="checkout" element={<CheckoutPage cart = {cartItems}  />}  />
      <Route path='orders' element={<OrdersPage/>}/>
      <Route path="/tracking/:orderId/:productId" element={<TrackingPage/>} />
       <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
  </Routes>
  )
}

export default App
