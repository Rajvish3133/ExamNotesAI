import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getCurrentUser } from './services/api.js'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import History from './pages/History.jsx'
import Notes from './pages/Notes.jsx'
import Pricing from './pages/Pricing.jsx'
import PaymentSuccess from './pages/PaymentSuccess.jsx'
import PaymentFailed from './pages/PaymentFailed.jsx'

export const serverUrl = "http://localhost:8000"


const App = () => {

  const dispatch = useDispatch()
  useEffect(() =>{
    getCurrentUser(dispatch)
  },[dispatch])

const {userData} = useSelector((state) => state.user)

console.log("userData:", userData)

  return (
    <>
    <Routes>
      <Route path='/' element={userData ? <Home/> : <Navigate to="/auth" replace />} />
      <Route path='/auth' element={userData ? <Navigate to="/"  replace/> : <Auth />} />
       <Route path='/history' element={userData? <History/> : <Navigate to="/auth" replace/>}/>
       <Route path='/notes' element={userData? <Notes/> : <Navigate to="/auth" replace/>}/>
       <Route path='/pricing' element={userData? <Pricing/> : <Navigate to="/auth" replace/>}/>
      
      <Route path='/payment-success' element={<PaymentSuccess/>}/>
      <Route path='/payment-failed' element={<PaymentFailed/>}/>
    </Routes>
    </>
  )
}

export default App
