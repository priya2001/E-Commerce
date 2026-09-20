import { FiChevronDown, FiSearch, FiShoppingCart, FiUser } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'

function Header({ userName }) {
  const navigate = useNavigate()

  return (
    <header className="store-header">
      <div className="header-inner">
        <Link className="brand" to="/" aria-label="ShopKart home">
          <strong>ShopKart</strong>
          <span>Explore <em>Plus</em></span>
        </Link>
        <label className="search-box">
          <FiSearch aria-hidden="true" />
          <input type="search" placeholder="Search for Products, Brands and More" />
        </label>
        <nav className="header-actions" aria-label="Main navigation">
          <button
            type="button"
            className="header-action"
            onClick={() => navigate(userName ? '/account/profile' : '/login')}
          >
            <FiUser className="action-icon" aria-hidden="true" />
            <span>{userName || 'Account'}</span>
            <FiChevronDown className="chevron" aria-hidden="true" />
          </button>
          <button type="button" className="header-action">
            <FiShoppingCart className="action-icon" aria-hidden="true" />
            <span>Cart</span>
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Header
