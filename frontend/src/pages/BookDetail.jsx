import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { api, MEDIA_BASE } from '../api.js'

export default function BookDetail() {
  const { bookId } = useParams()
  const [book, setBook] = useState(null)
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const load = () => {
    api.getBook(bookId).then(setBook).catch((e) => setError(e.message))
  }

  useEffect(() => {
    load()
    api.listUsers().then(setUsers).catch(() => { })
  }, [bookId])

  if (error && !book) return <p className="error">{error}</p>
  if (!book) return <p className="muted">Loading…</p>

  const handleIssue = async () => {
    if (!selectedUser) return
    try { await api.issueBook(bookId, selectedUser); load() } catch (e) { setError(e.message) }
  }
  const handleReturn = async () => {
    try { await api.returnBook(bookId); load() } catch (e) { setError(e.message) }
  }
  const handleDelete = async () => {
    if (!confirm('Delete this book?')) return
    try { await api.deleteBook(bookId); navigate('/') } catch (e) { setError(e.message) }
  }

  const qrUrl = book.qr_code
    ? (book.qr_code.startsWith('http') ? book.qr_code : `${MEDIA_BASE}${book.qr_code}`)
    : null

  return (
    <div>
      <Link to="/" className="back-link">← Back to collection</Link>

      <header className="page-head">
        <div>
          <div className="eyebrow">{book.genre || 'Volume'}</div>
          <h1>{book.title}</h1>
          <p className="lead">by {book.author}{book.publication_year ? ` · ${book.publication_year}` : ''}</p>
        </div>
        <div className="actions">
          <Link to={`/books/${bookId}/edit`}><button className="ghost">Edit</button></Link>
          <button className="danger" onClick={handleDelete}>Delete</button>
        </div>
      </header>

      {error && <p className="error">{error}</p>}

      <div className="detail-grid">
        <div>
          <div className="detail-meta">
            <dl>
              <dt>Book ID</dt><dd>{book.book_id}</dd>
              <dt>Status</dt><dd><span className={`badge ${book.status === 'AVAILABLE' ? 'available' : 'issued'}`}>{book.status}</span></dd>
              <dt>Holder</dt><dd>{book.current_holder_name || 'Available'}</dd>
              <dt>Genre</dt><dd>{book.genre || '—'}</dd>
              <dt>Year</dt><dd>{book.publication_year || '—'}</dd>
            </dl>
          </div>

          <div className="actions" style={{ marginTop: 24 }}>
            {book.status === 'AVAILABLE' ? (
              <>
                <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} style={{ maxWidth: 240 }}>
                  <option value="">Select a user…</option>
                  {users.map((u) => <option key={u.id} value={u.id}>{u.display_name || u.name}</option>)}
                </select>
                <button className="primary" onClick={handleIssue} disabled={!selectedUser}>Issue Book</button>
              </>
            ) : (
              <button className="primary" onClick={handleReturn}>Mark Returned</button>
            )}
          </div>
        </div>

        {qrUrl && (
          <div className="qr-card">
            <img src={qrUrl} alt="QR" />
            <div className="label">Scan with any phone camera</div>
          </div>
        )}
      </div>
    </div>
  )
}
