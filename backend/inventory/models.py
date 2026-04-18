import qrcode
import io
import base64
from django.db import models
# from .qr_utils import generate_qr_file


class User(models.Model):
    name = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Book(models.Model):
    AVAILABLE = "AVAILABLE"
    ISSUED = "ISSUED"
    STATUS_CHOICES = [(AVAILABLE, "Available"), (ISSUED, "Issued")]

    book_id = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    genre = models.CharField(max_length=100, blank=True, default="")
    publication_year = models.IntegerField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=AVAILABLE)
    current_holder = models.ForeignKey(
        User, null=True, blank=True, on_delete=models.SET_NULL, related_name="held_books"
    )
    # qr_code = models.ImageField(upload_to="qr_codes/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.book_id} - {self.title}"

    def get_qr_code(self):
        import os

        # frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:5173")
        frontend_url = os.environ.get("FRONTEND_URL", "https://ankit-assignment.onrender.com")
        qr_data = f"{frontend_url}/book/{self.book_id}"
        
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(qr_data)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")

        buffer = io.BytesIO()
        img.save(buffer, format="PNG")
        qr_base64 = base64.b64encode(buffer.getvalue()).decode()

        return f"data:image/png;base64,{qr_base64}"
        
    """def save(self, *args, **kwargs):
        regenerate = False
        if not self.pk:
            regenerate = True
        else:
            try:
                old = Book.objects.get(pk=self.pk)
                if old.book_id != self.book_id or not self.qr_code:
                    regenerate = True
            except Book.DoesNotExist:
                regenerate = True
        super().save(*args, **kwargs)
        if regenerate:
            self.qr_code.save(f"{self.book_id}.png", generate_qr_file(self.book_id), save=False)
            super().save(update_fields=["qr_code"])"""


class BorrowTransaction(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="transactions")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="transactions")
    issued_at = models.DateTimeField(auto_now_add=True)
    returned_at = models.DateTimeField(null=True, blank=True)
