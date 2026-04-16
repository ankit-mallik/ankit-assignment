import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api.js'

export default function BookList() {
  const [books, setBooks] = useState([])
  const [selected, setSelected] = useState(new Set())
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.listBooks()
      .then(setBooks)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const toggle = (id) => {
    const next = new Set(selected)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelected(next)
  }

  const printSelected = () => {
    if (selected.size === 0) return
    navigate(`/print?ids=${Array.from(selected).join(',')}`)
  }

  if (loading) return <p className="muted">Loading…</p>

  return (
    <div>
      <header className="page-head">
        <div>
          <h1>Books</h1>
        </div>
        <div className="actions">
          {selected.size > 0 && (
            <button className="ghost" onClick={printSelected}>
              Print QR · {selected.size}
            </button>
          )}
          <Link to="/books/new"><button className="primary">+ New Book</button></Link>
        </div>
      </header>

      {error && <p className="error">{error}</p>}

      {books.length === 0 ? (
        <div className="empty">
          <div className="glyph">◆</div>
          <h2>No books yet</h2>
          <p className="muted">Start your collection by adding the first one.</p>
          <div style={{ marginTop: 20 }}>
            <Link to="/books/new"><button className="primary">+ Add a Book</button></Link>
          </div>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: 40 }}></th>
                <th>Title</th>
                <th>Book ID</th>
                <th>Status</th>
                <th>Holder</th>
              </tr>
            </thead>
            <tbody>
              {books.map((b) => (
                <tr key={b.book_id} onClick={() => navigate(`/books/${b.book_id}`)} style={{ cursor: 'pointer' }}>
                  <td onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="cb"
                      checked={selected.has(b.book_id)}
                      onChange={() => toggle(b.book_id)}
                    />
                  </td>
                  <td>
                    <div className="title">{b.title}</div>
                    <div className="author">{b.author}</div>
                  </td>
                  <td className="muted">{b.book_id}</td>
                  <td>
                    <span className={`badge ${b.status === 'AVAILABLE' ? 'available' : 'issued'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="muted">{b.current_holder_name || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
