import Login from './pages/login'
import Register from './pages/register'
import Profile from './pages/profile'
import Header from './components/Header'
import VerifyOtp from './pages/verifyOtp'
import { useState } from 'react'

function App() {
  const [authView, setAuthView] = useState(
    localStorage.getItem('authToken') ? 'profile' : 'login',
  )
  const [currentUser, setCurrentUser] = useState(() =>
    JSON.parse(localStorage.getItem('authUser') || 'null'),
  )
  const [verificationEmail, setVerificationEmail] = useState('')

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
    setCurrentUser(null)
    setAuthView('login')
  }

  if (authView === 'profile') {
    return (
      <div className="store-page" id="top">
        <Header userName={currentUser?.name} />
        <Profile onLogout={handleLogout} onProfileUpdated={setCurrentUser} />
      </div>
    )
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        {authView === 'otp' ? (
          <VerifyOtp
            email={verificationEmail}
            onVerified={() => setAuthView('login')}
            onBack={() => setAuthView('register')}
          />
        ) : authView === 'login' ? (
          <Login
            onSwitchToRegister={() => setAuthView('register')}
            onLogin={(user) => {
              setCurrentUser(user)
              setAuthView('profile')
            }}
          />
        ) : (
          <Register
            onSwitchToLogin={() => setAuthView('login')}
            onRegistered={(email) => {
              setVerificationEmail(email)
              setAuthView('otp')
            }}
          />
        )}
      </section>
    </main>
  )
}

export default App
