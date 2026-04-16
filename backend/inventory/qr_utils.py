import io
import qrcode
from django.conf import settings
from django.core.files.base import ContentFile


def generate_qr_file(book_id: str):
    """Generate a QR PNG ContentFile encoding {FRONTEND_URL}/books/<book_id>."""
    url = f"{settings.FRONTEND_URL.rstrip('/')}/books/{book_id}"
    img = qrcode.make(url)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return ContentFile(buf.getvalue(), name=f"{book_id}.png")
