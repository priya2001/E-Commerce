import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Header from './components/Header'
import CategoryPage from './pages/categoryPage'
import Home from './pages/home'
import Login from './pages/login'
import Profile from './pages/profile'
import Register from './pages/register'
import VerifyOtp from './pages/verifyOtp'

function App() {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(() =>
    JSON.parse(localStorage.getItem('authUser') || 'null'),
  )
  const [verificationEmail, setVerificationEmail] = useState('')
  const isLoggedIn = Boolean(localStorage.getItem('authToken'))

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
    setCurrentUser(null)
    navigate('/login')
  }

  const storeLayout = (content) => (
    <div className="store-page">
      <Header userName={currentUser?.name} />
      {content}
    </div>
  )

  const authLayout = (content) => (
    <main className="auth-page">
      <section className="auth-card">{content}</section>
    </main>
  )

  return (
    <Routes>
      <Route path="/" element={storeLayout(<Home />)} />
      <Route path="/category/:slug" element={storeLayout(<CategoryPage />)} />
      <Route
        path="/account/profile"
        element={
          isLoggedIn
            ? storeLayout(
                <Profile onLogout={handleLogout} onProfileUpdated={setCurrentUser} />,
              )
            : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/login"
        element={authLayout(
          <Login
            onSwitchToRegister={() => navigate('/register')}
            onLogin={(user) => {
              setCurrentUser(user)
              navigate('/account/profile')
            }}
          />,
        )}
      />
      <Route
        path="/register"
        element={authLayout(
          <Register
            onSwitchToLogin={() => navigate('/login')}
            onRegistered={(email) => {
              setVerificationEmail(email)
              navigate('/verify-otp')
            }}
          />,
        )}
      />
      <Route
        path="/verify-otp"
        element={
          verificationEmail
            ? authLayout(
                <VerifyOtp
                  email={verificationEmail}
                  onVerified={() => navigate('/login')}
                  onBack={() => navigate('/register')}
                />,
              )
            : <Navigate to="/register" replace />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
