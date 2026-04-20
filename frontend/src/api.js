const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    let err
    try { err = await res.json() } catch { err = { detail: res.statusText } }
    throw new Error(err.detail || JSON.stringify(err))
  }
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  listBooks: () => request('/api/books/'),
  getBook: (id) => request(`/api/books/${id}/`),
  createBook: (data) => request('/api/books/', { method: 'POST', body: JSON.stringify(data) }),
  updateBook: (id, data) => request(`/api/books/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteBook: (id) => request(`/api/books/${id}/`, { method: 'DELETE' }),
  issueBook: (id, user_id) => request(`/api/books/${id}/issue/`, { method: 'POST', body: JSON.stringify({ user_id }) }),
  returnBook: (id) => request(`/api/books/${id}/return/`, { method: 'POST' }),
  printBooks: (ids) => request(`/api/books/print/?ids=${ids.join(',')}`),
  listUsers: () => request('/api/users/'),
  createUser: (name) => request('/api/users/', { method: 'POST', body: JSON.stringify({ name }) }),
  deleteUser: (id) => request(`/api/users/${id}/`, { method: 'DELETE' }),
}

export const MEDIA_BASE = BASE
