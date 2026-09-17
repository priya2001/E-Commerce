const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

const requestJson = async (path, payload) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
  }

  return data
}

export const loginUser = (payload) => requestJson('/api/auth/login', payload)

export const registerUser = (payload) => requestJson('/api/auth/register', payload)

export const verifyOtp = (payload) => requestJson('/api/auth/verify-otp', payload)

const profileRequest = async (method, payload) => {
  const token = localStorage.getItem('authToken')
  const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    ...(payload ? { body: JSON.stringify(payload) } : {}),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
  }

  return data
}

export const getProfile = () => profileRequest('GET')

export const updateProfile = (payload) => profileRequest('PUT', payload)
