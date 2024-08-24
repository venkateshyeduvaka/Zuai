import React from 'react'
import {Routes, Route } from 'react-router-dom';

import { Toaster } from "react-hot-toast";

import Home from './pages/Home'
import LoginForm from './pages/LoginForm'
import RegisterForm from './pages/RegisterForm'

import ProtectedRoute from './components/ProductRoute';

function App() {
  return (
    <div>
      <Toaster/>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />}  />
        <Route path="/"  element={<ProtectedRoute element={Home}/>}/>
      </Routes>
    </div>
  )
}

export default App
