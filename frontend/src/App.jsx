import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import BookList from './pages/BookList.jsx'
import BookDetail from './pages/BookDetail.jsx'
import BookForm from './pages/BookForm.jsx'
import Users from './pages/Users.jsx'
import PrintQR from './pages/PrintQR.jsx'

export default function App() {
  const location = useLocation()
  const isPrint = location.pathname.startsWith('/print')

  if (isPrint) {
    return (
      <Routes>
        <Route path="/print" element={<PrintQR />} />
      </Routes>
    )
  }

  return (
    <div className="layout">
      <aside className="sidebar no-print">
        <div className="brand">
          <span className="brand-mark">◆</span>
          <span className="brand-name">Book Inventory</span>
        </div>
        <nav className="side-nav">
          <NavLink to="/" end className={({ isActive }) => 'side-link' + (isActive ? ' active' : '')}>
            <span>Books</span>
          </NavLink>
          <NavLink to="/users" className={({ isActive }) => 'side-link' + (isActive ? ' active' : '')}>
            <span>Users</span>
          </NavLink>
        </nav>
        <div className="sidebar-foot">
          <span>Book Inventory</span>
          <span className="muted">v1.0</span>
        </div>
      </aside>
      <main className="content">
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/books/new" element={<BookForm />} />
          <Route path="/books/:bookId" element={<BookDetail />} />
          <Route path="/books/:bookId/edit" element={<BookForm />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </main>
    </div>
  )
}
