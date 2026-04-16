import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api, MEDIA_BASE } from '../api.js'

export default function PrintQR() {
  const [params] = useSearchParams()
  const ids = (params.get('ids') || '').split(',').filter(Boolean)
  const [books, setBooks] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (ids.length === 0) return
    api.printBooks(ids).then(setBooks).catch((e) => setError(e.message))
  }, [params])

  // Pad to multiples of 12 for clean grid pages
  const cells = [...books]
  while (cells.length % 12 !== 0) cells.push(null)

  return (
    <div>
      <div className="no-print actions">
        <button className="primary" onClick={() => window.print()}>Print</button>
        <span className="muted">{books.length} book(s) selected</span>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="print-grid">
        {cells.map((b, i) => (
          <div key={i} className="print-cell">
            {b && b.qr_code && (
              <>
                <img src={b.qr_code.startsWith('http') ? b.qr_code : `${MEDIA_BASE}${b.qr_code}`} alt="QR" />
                <div className="title">{b.title}</div>
                <div className="bid">{b.book_id}</div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
