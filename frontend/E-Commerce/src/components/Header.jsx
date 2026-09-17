function Header({ userName }) {
  return (
    <header className="store-header">
      <div className="header-inner">
        <a className="brand" href="#top" aria-label="ShopKart home">
          <strong>ShopKart</strong>
          <span>Explore <em>Plus</em></span>
        </a>
        <label className="search-box">
          <span aria-hidden="true"></span>
          <input type="search" placeholder="Search for Products, Brands and More" />
        </label>
        <nav className="header-actions" aria-label="Main navigation">
          <button type="button" className="header-action">
            <span className="action-icon" aria-hidden="true"></span>
            <span>{userName || 'Account'}</span>
            <span className="chevron" aria-hidden="true">⌄</span>
          </button>
          <button type="button" className="header-action">
            <span className="action-icon" aria-hidden="true"></span>
            <span>Cart</span>
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Header
