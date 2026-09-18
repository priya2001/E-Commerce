import { useEffect, useState } from 'react'
import {
  FiBell,
  FiChevronRight,
  FiCreditCard,
  FiFileText,
  FiGift,
  FiHeart,
  FiLogOut,
  FiMapPin,
  FiPackage,
  FiPercent,
  FiStar,
  FiUser,
} from 'react-icons/fi'
import { getProfile, updateProfile } from '../services/authApi'

const sectionDetails = {
  orders: {
    title: 'My Orders',
    icon: FiPackage,
    message: 'You have not placed any orders yet.',
  },
  addresses: {
    title: 'Manage Addresses',
    icon: FiMapPin,
    message: 'No delivery address has been saved yet.',
  },
  pan: {
    title: 'PAN Card Information',
    icon: FiFileText,
    message: 'No PAN card information has been added.',
  },
  giftCards: {
    title: 'Gift Cards',
    icon: FiGift,
    message: 'You do not have any gift cards.',
  },
  upi: {
    title: 'Saved UPI',
    icon: FiCreditCard,
    message: 'No UPI ID has been saved.',
  },
  coupons: {
    title: 'My Coupons',
    icon: FiPercent,
    message: 'There are no available coupons in your account.',
  },
  reviews: {
    title: 'My Reviews & Ratings',
    icon: FiStar,
    message: 'You have not reviewed any products yet.',
  },
  notifications: {
    title: 'All Notifications',
    icon: FiBell,
    message: 'You do not have any new notifications.',
  },
  wishlist: {
    title: 'My Wishlist',
    icon: FiHeart,
    message: 'Your wishlist is currently empty.',
  },
}

function Profile({ onLogout, onProfileUpdated }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', gender: '' })
  const [savedProfile, setSavedProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [activeSection, setActiveSection] = useState('profile')
  const [, setMessage] = useState('')
  const [, setError] = useState('')

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
  const ActiveSectionIcon = sectionDetails[activeSection]?.icon

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
          <button
            type="button"
            className={`menu-heading ${activeSection === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveSection('orders')}
          >
            <span className="menu-icon"><FiPackage /></span><span>MY ORDERS</span><FiChevronRight className="menu-arrow" />
          </button>

          <section className="menu-section">
            <h2><span className="menu-icon"><FiUser /></span> ACCOUNT SETTINGS</h2>
            <button type="button" className={`menu-item ${activeSection === 'profile' ? 'active' : ''}`} onClick={() => setActiveSection('profile')}>Profile Information</button>
            <button type="button" className={`menu-item ${activeSection === 'addresses' ? 'active' : ''}`} onClick={() => setActiveSection('addresses')}>Manage Addresses</button>
            <button type="button" className={`menu-item ${activeSection === 'pan' ? 'active' : ''}`} onClick={() => setActiveSection('pan')}>PAN Card Information</button>
          </section>

          <section className="menu-section">
            <h2><span className="menu-icon"><FiCreditCard /></span> PAYMENTS</h2>
            <button type="button" className={`menu-item ${activeSection === 'giftCards' ? 'active' : ''}`} onClick={() => setActiveSection('giftCards')}>Gift Cards</button>
            <button type="button" className={`menu-item ${activeSection === 'upi' ? 'active' : ''}`} onClick={() => setActiveSection('upi')}>Saved UPI</button>
          </section>

          <section className="menu-section">
            <h2><span className="menu-icon"><FiHeart /></span> MY STUFF</h2>
            <button type="button" className={`menu-item ${activeSection === 'coupons' ? 'active' : ''}`} onClick={() => setActiveSection('coupons')}>My Coupons</button>
            <button type="button" className={`menu-item ${activeSection === 'reviews' ? 'active' : ''}`} onClick={() => setActiveSection('reviews')}>My Reviews & Ratings</button>
            <button type="button" className={`menu-item ${activeSection === 'notifications' ? 'active' : ''}`} onClick={() => setActiveSection('notifications')}>All Notifications</button>
            <button type="button" className={`menu-item ${activeSection === 'wishlist' ? 'active' : ''}`} onClick={() => setActiveSection('wishlist')}>My Wishlist</button>
          </section>

          <button className="sidebar-logout" type="button" onClick={onLogout}><span className="menu-icon"><FiLogOut /></span>Logout</button>
        </div>
      </aside>

      {activeSection === 'profile' ? (
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
      ) : (
        <section className="profile-panel section-panel">
          <div className="section-heading">
            <span><ActiveSectionIcon /></span>
            <h1>{sectionDetails[activeSection].title}</h1>
          </div>
          <div className="empty-state">
            <div className="empty-state-icon"><ActiveSectionIcon /></div>
            <h2>Nothing here yet</h2>
            <p>{sectionDetails[activeSection].message}</p>
            <span>This section is ready to connect when its backend module is added.</span>
          </div>
        </section>
      )}
    </main>
  )
}

export default Profile
