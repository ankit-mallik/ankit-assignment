import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { api } from '../api.js'

const empty = { book_id: '', title: '', author: '', genre: '', publication_year: '' }

export default function BookForm() {
  const { bookId } = useParams()
  const isEdit = Boolean(bookId)
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (isEdit) {
      api.getBook(bookId).then((b) => setForm({
        book_id: b.book_id,
        title: b.title,
        author: b.author,
        genre: b.genre || '',
        publication_year: b.publication_year || '',
      })).catch((e) => setError(e.message))
    }
  }, [bookId])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    const payload = {
      ...form,
      publication_year: form.publication_year ? parseInt(form.publication_year, 10) : null,
    }
    try {
      if (isEdit) {
        await api.updateBook(bookId, payload)
        navigate(`/books/${form.book_id}`)
      } else {
        const created = await api.createBook(payload)
        navigate(`/books/${created.book_id}`)
      }
    } catch (e) { setError(e.message) }
  }

  return (
    <div>
      <Link to="/" className="back-link">← Back to collection</Link>
      <header className="page-head">
        <div>
          <div className="eyebrow">{isEdit ? 'Editing' : 'New entry'}</div>
          <h1>{isEdit ? 'Edit Book' : 'Add a Book'}</h1>
          <p className="lead">A QR code is generated automatically and printed on demand.</p>
        </div>
      </header>

      {error && <p className="error">{error}</p>}

      <form onSubmit={submit} className="form-card">
        <div className="form-group">
          <label>Book ID</label>
          <input value={form.book_id} onChange={set('book_id')} placeholder="BK0001" required />
        </div>
        <div className="form-group">
          <label>Title</label>
          <input value={form.title} onChange={set('title')} required />
        </div>
        <div className="form-group">
          <label>Author</label>
          <input value={form.author} onChange={set('author')} required />
        </div>
        <div className="form-group">
          <label>Genre</label>
          <input value={form.genre} onChange={set('genre')} />
        </div>
        <div className="form-group">
          <label>Publication Year</label>
          <input type="number" value={form.publication_year} onChange={set('publication_year')} />
        </div>
        <div className="actions" style={{ marginTop: 24 }}>
          <button type="submit" className="primary">{isEdit ? 'Save changes' : 'Create book'}</button>
          <Link to="/"><button type="button" className="ghost">Cancel</button></Link>
        </div>
      </form>
    </div>
  )
}
