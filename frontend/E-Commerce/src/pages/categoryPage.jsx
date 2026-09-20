import { useEffect, useState } from 'react'
import { FiChevronRight, FiGrid, FiPackage } from 'react-icons/fi'
import { Link, useParams } from 'react-router-dom'
import { getCategoryBySlug } from '../services/categoryApi'

function CategoryPage() {
  const { slug } = useParams()
  const [category, setCategory] = useState(null)
  const [subcategories, setSubcategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadCategory = async () => {
      setLoading(true)
      setError('')

      try {
        const data = await getCategoryBySlug(slug)
        setCategory(data.category)
        setSubcategories(data.subcategories)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadCategory()
  }, [slug])

  if (loading) return <main className="category-page"><div className="page-state">Loading category...</div></main>
  if (error) return <main className="category-page"><div className="page-state error-message">{error}</div></main>

  return (
    <main className="category-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link><FiChevronRight /><span>{category.name}</span>
      </nav>

      <section className="category-banner">
        <div>
          <span className="hero-kicker">FEATURED CATEGORY</span>
          <h1>{category.name}</h1>
          <p>Choose a subcategory to start exploring.</p>
        </div>
        <FiGrid />
      </section>

      <section className="home-section category-content">
        <div className="home-section-heading"><h2>Browse {category.name}</h2></div>
        {subcategories.length ? (
          <div className="subcategory-grid">
            {subcategories.map((subcategory) => (
              <article className="subcategory-card" key={subcategory._id}>
                <span><FiPackage /></span>
                <div>
                  <h3>{subcategory.name}</h3>
                  <p>Products will appear here next.</p>
                </div>
                <FiChevronRight className="subcategory-arrow" />
              </article>
            ))}
          </div>
        ) : (
          <div className="page-state">No subcategories available yet.</div>
        )}
      </section>
    </main>
  )
}

export default CategoryPage
