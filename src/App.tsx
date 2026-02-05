import { Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout/MainLayout'
import Profile from './pages/Profile'
import Home from './pages/Home'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Middleware from './components/middleware/Middleware'
import VerifyEmail from './pages/Verify'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Explore from './pages/Explore'
import ChatLayout from './pages/ChatLayout'


export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route element={<Middleware />}>
          <Route element={<MainLayout />}>
            <Route path='/' element={<Home />} />
            <Route path='/profile/:userId' element={<Profile />} />
            <Route path='/explore' element={<Explore />} />
            <Route path='/messages' element={<ChatLayout />} />
            <Route path='/messages/:conversationId' element={<ChatLayout />} />
          </Route>
        </Route>
      </Routes>

    </div>
  )
}
