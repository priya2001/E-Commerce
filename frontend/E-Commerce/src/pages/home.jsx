import { useEffect, useState } from 'react'
import {
  FiCoffee,
  FiGrid,
  FiHome,
  FiMonitor,
  FiShoppingBag,
  FiSmartphone,
} from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { getCategories } from '../services/categoryApi'

const categoryIcons = {
  electronics: FiMonitor,
  mobiles: FiSmartphone,
  fashion: FiShoppingBag,
  home: FiHome,
  grocery: FiCoffee,
}

function Home() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data.categories)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  return (
    <main className="home-page">
      <section className="category-strip" aria-label="Shop by category">
        {loading ? <p className="category-message">Loading categories...</p> : null}
        {error ? <p className="category-message error-message">{error}</p> : null}
        {!loading && !error && categories.length === 0 ? (
          <p className="category-message">No categories available yet.</p>
        ) : null}
        {categories.map((category) => {
          const CategoryIcon = categoryIcons[category.slug] || FiGrid

          return (
            <Link className="category-card" to={`/category/${category.slug}`} key={category._id}>
              <span className="category-icon"><CategoryIcon /></span>
              <strong>{category.name}</strong>
            </Link>
          )
        })}
      </section>

      <section className="home-hero">
        <div className="hero-copy">
          <span className="hero-kicker">SHOPKART SPECIALS</span>
          <h1>Everything you need, all in one place.</h1>
          <p>Explore categories, discover new products and enjoy a simple shopping experience.</p>
          {categories[0] ? (
            <Link className="hero-button" to={`/category/${categories[0].slug}`}>Explore now</Link>
          ) : null}
        </div>
        <div className="hero-art" aria-hidden="true">
          <span className="hero-orbit orbit-one"></span>
          <span className="hero-orbit orbit-two"></span>
          <FiShoppingBag />
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-heading">
          <div>
            <span>START EXPLORING</span>
            <h2>Shop by category</h2>
          </div>
        </div>
        <div className="featured-grid">
          {categories.map((category) => {
            const CategoryIcon = categoryIcons[category.slug] || FiGrid

            return (
              <Link className="featured-card" to={`/category/${category.slug}`} key={category._id}>
                <div><CategoryIcon /></div>
                <h3>{category.name}</h3>
                <p>View subcategories</p>
              </Link>
            )
          })}
        </div>
      </section>
    </main>
  )
}

export default Home
