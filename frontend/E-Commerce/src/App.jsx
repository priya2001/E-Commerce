import Login from './pages/login'
import Register from './pages/register'
import { useState } from 'react'

function App() {
  const [authView, setAuthView] = useState('login')

  return (
    <main className="auth-page">
      <section className="auth-card">
        {authView === 'login' ? (
          <Login onSwitchToRegister={() => setAuthView('register')} />
        ) : (
          <Register onSwitchToLogin={() => setAuthView('login')} />
        )}
      </section>
    </main>
  )
}

export default App
