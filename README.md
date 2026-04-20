# Book Inventory Management System

QR-based book inventory app. React (Vite) frontend + Django REST backend + SQLite.

## Features

- Add, view, edit, delete books
- Add, delete user
- Auto-generated QR codes (encode `/books/<book_id>` URL)
- Issue books to users / return books
- Print selected QR codes in a 3×4 A4 grid
- Scan a printed QR with any phone camera → opens book detail page

## Project Structure

```
backend/    Django + DRF API
frontend/   Vite + React UI
```

## Local Setup

### 1. Backend (Django)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate         # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

The API will be at `http://localhost:8000/api/`.

Optional environment variables:
- `DJANGO_SECRET_KEY` — secret key (defaults to dev key)
- `DJANGO_DEBUG` — `1`/`0` (default `1`)
- `DJANGO_ALLOWED_HOSTS` — comma-separated (default `*`)
- `FRONTEND_URL` — used inside QR codes (default `http://localhost:5173`)

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install
cp .env.example .env              # then edit if backend URL differs
npm run dev
```

App runs at `http://localhost:5173`.

Environment variables (in `frontend/.env`):
- `VITE_API_URL` — backend base URL (default `http://localhost:8000`)

## End-to-End Smoke Test

1. Open `http://localhost:5173`
2. Go to **Users** → add a user (e.g., "Alice")
3. Go to **Add Book** → create a book (e.g., `BK0001`, "The Hobbit")
4. Open the book → see QR code
5. Click **Issue** → pick Alice → status flips to ISSUED
6. Click **Return** → status flips back to AVAILABLE
7. Back on the list, check the box → click **Print QR** → browser print dialog
8. Print the QR, scan with your phone camera — opens the detail page

## API Reference

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/books/` | List books |
| POST | `/api/books/` | Create book (auto QR) |
| GET | `/api/books/<book_id>/` | Retrieve book |
| PATCH | `/api/books/<book_id>/` | Update book |
| DELETE | `/api/books/<book_id>/` | Delete (blocked if ISSUED) |
| POST | `/api/books/<book_id>/issue/` | Body `{user_id}` |
| POST | `/api/books/<book_id>/return/` | Return |
| GET | `/api/books/print/?ids=BK1,BK2` | Bulk fetch for print page |
| GET | `/api/users/` | List users |
| POST | `/api/users/` | Body `{name}` |



