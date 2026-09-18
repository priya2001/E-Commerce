import { useState } from 'react'
import { FiCheck } from 'react-icons/fi'
import { verifyOtp } from '../services/authApi'

function VerifyOtp({ email, onVerified, onBack }) {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      await verifyOtp({ email, otp })
      onVerified()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-form otp-form">
      <div className="otp-icon"><FiCheck /></div>
      <h1>Verify OTP</h1>
      <p className="otp-description">
        Enter the testing OTP for <strong>{email}</strong>
      </p>
      <div className="testing-otp">Testing OTP: <strong>123456</strong></div>

      <form onSubmit={handleSubmit}>
        <input
          className="otp-input"
          type="text"
          inputMode="numeric"
          maxLength="6"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(event) => setOtp(event.target.value.replace(/\D/g, ''))}
          required
        />
        <button type="submit" disabled={loading || otp.length !== 6}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>

      {error ? <p className="error-message">{error}</p> : null}
      <button className="auth-link-button" type="button" onClick={onBack}>
        Back to registration
      </button>
    </div>
  )
}

export default VerifyOtp
