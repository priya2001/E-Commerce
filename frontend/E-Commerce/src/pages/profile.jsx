import { useEffect, useState } from 'react'
import { getProfile, updateProfile } from '../services/authApi'

function Profile({ onLogout, onProfileUpdated }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', gender: '' })
  const [savedProfile, setSavedProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile()
        const profile = {
          name: data.user.name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          gender: data.user.gender || '',
        }
        setFormData(profile)
        setSavedProfile(profile)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    try {
      const data = await updateProfile({
        name: formData.name,
        phone: formData.phone,
        gender: formData.gender,
      })
      localStorage.setItem('authUser', JSON.stringify(data.user))
      setSavedProfile({ ...formData })
      onProfileUpdated(data.user)
      setMessage(data.message)
      setIsEditing(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const initial = formData.name?.charAt(0).toUpperCase() || 'U'

  const cancelEditing = () => {
    if (savedProfile) setFormData(savedProfile)
    setIsEditing(false)
    setError('')
  }

  if (loading) return <div className="profile-loading">Loading your profile...</div>

  return (
    <main className="account-layout">
      <aside className="account-sidebar">
        <div className="hello-card">
          <div className="avatar">{initial}</div>
          <div><small>Hello,</small><strong>{formData.name}</strong></div>
        </div>

        <div className="account-menu">
          <button type="button" className="menu-heading">
            <span className="menu-icon"></span><span>MY ORDERS</span><span className="menu-arrow">›</span>
          </button>

          <section className="menu-section">
            <h2><span className="menu-icon"></span> ACCOUNT SETTINGS</h2>
            <button type="button" className="menu-item active">Profile Information</button>
            <button type="button" className="menu-item">Manage Addresses</button>
            <button type="button" className="menu-item">PAN Card Information</button>
          </section>

          <section className="menu-section">
            <h2><span className="menu-icon"></span> PAYMENTS</h2>
            <button type="button" className="menu-item">Gift Cards</button>
            <button type="button" className="menu-item">Saved UPI</button>
          </section>

          <section className="menu-section">
            <h2><span className="menu-icon"></span> MY STUFF</h2>
            <button type="button" className="menu-item">My Coupons</button>
            <button type="button" className="menu-item">My Reviews & Ratings</button>
            <button type="button" className="menu-item">All Notifications</button>
            <button type="button" className="menu-item">My Wishlist</button>
          </section>

          <button className="sidebar-logout" type="button" onClick={onLogout}> <span className="menu-icon"></span>Logout </button>
        </div>
      </aside>

      <section className="profile-panel">
        <div className="profile-title-row">
          <h1>Personal Information</h1>
          {!isEditing && <button className="edit-button" type="button" onClick={() => setIsEditing(true)}>Edit</button>}
        </div>

        <form className="profile-form" onSubmit={handleSubmit}>
          <label className="name-field">
            First & Last Name
            <input name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} required />
          </label>

          <fieldset disabled={!isEditing}>
            <legend>Your Gender</legend>
            <label className="radio-label"><input type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleChange} /> Male</label>
            <label className="radio-label"><input type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleChange} /> Female</label>
            <label className="radio-label"><input type="radio" name="gender" value="other" checked={formData.gender === 'other'} onChange={handleChange} /> Other</label>
          </fieldset>

          <div className="profile-title-row contact-heading">
            <h2>Email Address</h2><span className="read-only-note">Verified account email</span>
          </div>
          <input className="contact-input" name="email" value={formData.email} disabled />

          <div className="profile-title-row contact-heading"><h2>Mobile Number</h2></div>
          <input className="contact-input" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter mobile number" disabled={!isEditing} />

          {isEditing && (
            <div className="form-actions">
              <button className="save-button" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
              <button className="cancel-button" type="button" onClick={cancelEditing}>Cancel</button>
            </div>
          )}
        </form>
 
      </section>
    </main>
  )
}

export default Profile
