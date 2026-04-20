import { useEffect, useState } from 'react'
import { api } from '../api.js'

export default function Users() {
  const [users, setUsers] = useState([])
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const load = () => api.listUsers().then(setUsers).catch((e) => setError(e.message))

  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    try {
      await api.createUser(name.trim())
      setName('')
      load()
    } catch (e) { setError(e.message) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      setError('')
      await api.deleteUser(id)
      load()
    } catch (e) {
      let msg = e.message || 'An error occurred'
      
      // If the error message is a stringified JSON object (like in your screenshot)
      if (typeof msg === 'string' && msg.startsWith('{')) {
        try {
          const parsed = JSON.parse(msg)
          msg = parsed.error || msg
        } catch (err) {
          // If parsing fails, just keep the original message
        }
      }
      
      setError(msg)
    }
  }

  return (
    <div>
      <header className="page-head">
        <div>
          <h1>Users</h1>
        </div>
      </header>

      {/* {error && <p className="error">{error}</p>} */}
      {error && (
        <div className="error-banner">
          <span className="icon">⚠️</span>
          <p>{error}</p>
          <button className="close-btn" onClick={() => setError('')}>&times;</button>
        </div>
      )}

      <form onSubmit={submit} className="form-card" style={{ marginBottom: 32 }}>
        <div className="form-group" style={{ marginBottom: 16 }}>
          <label>Add a user</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        </div>
        <button type="submit" className="primary">+ Add User</button>
      </form>

      {users.length === 0 ? (
        <div className="empty">
          <div className="glyph">◆</div>
          <h2>No users yet</h2>
          <p className="muted">Add the first borrower above.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: 80 }}>ID</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="muted">#{u.id}</td>
                  <td><span className="title">{u.name}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="danger" onClick={() => handleDelete(u.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
