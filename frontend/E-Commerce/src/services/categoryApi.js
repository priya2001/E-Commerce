const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

const getJson = async (path) => {
  const response = await fetch(`${API_BASE_URL}${path}`)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Unable to load categories')
  }

  return data
}

export const getCategories = () => getJson('/api/categories')

export const getCategoryBySlug = (slug) => getJson(`/api/categories/${slug}`)
