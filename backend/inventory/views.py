from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Book, User, BorrowTransaction
from .serializers import BookSerializer, UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by("-created_at")
    serializer_class = UserSerializer


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all().order_by("-created_at")
    serializer_class = BookSerializer
    lookup_field = "book_id"

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.status == Book.ISSUED:
            return Response(
                {"detail": "Cannot delete a book that is currently issued."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=["post"])
    def issue(self, request, book_id=None):
        book = self.get_object()
        if book.status == Book.ISSUED:
            return Response({"detail": "Book is already issued."}, status=400)
        user_id = request.data.get("user_id")
        if not user_id:
            return Response({"detail": "user_id is required."}, status=400)
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=404)
        book.status = Book.ISSUED
        book.current_holder = user
        book.save()
        BorrowTransaction.objects.create(book=book, user=user)
        return Response(BookSerializer(book, context={"request": request}).data)

    @action(detail=True, methods=["post"], url_path="return")
    def return_book(self, request, book_id=None):
        book = self.get_object()
        if book.status != Book.ISSUED:
            return Response({"detail": "Book is not currently issued."}, status=400)
        open_tx = BorrowTransaction.objects.filter(book=book, returned_at__isnull=True).first()
        if open_tx:
            open_tx.returned_at = timezone.now()
            open_tx.save()
        book.status = Book.AVAILABLE
        book.current_holder = None
        book.save()
        return Response(BookSerializer(book, context={"request": request}).data)

    @action(detail=False, methods=["get"], url_path="print")
    def print_books(self, request):
        ids = request.query_params.get("ids", "")
        id_list = [i for i in ids.split(",") if i]
        books = Book.objects.filter(book_id__in=id_list)
        return Response(BookSerializer(books, many=True, context={"request": request}).data)
