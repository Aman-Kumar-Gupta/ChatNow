import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/home_page'
import LoginPage from './pages/login_page'
import ProfilePage from './pages/profile_page'
import {Toaster} from 'react-hot-toast';
import { AuthContext } from '../context/auth_context'

const App = () => {
  const {authUser}=useContext(AuthContext)
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid #334155',
          },
        }}
      />
      <Routes>
        <Route path='/' element={authUser ? <HomePage/> : <Navigate to='/login' />}/>
        <Route path='/login' element={authUser ? <Navigate to='/' /> : <LoginPage/>}/>
        <Route path='/profile' element={authUser ? <ProfilePage/> : <Navigate to='/login' />}/>
      </Routes>
    </div>
  )
}

export default App
