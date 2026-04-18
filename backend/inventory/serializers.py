from rest_framework import serializers
from .models import Book, User, BorrowTransaction


class UserSerializer(serializers.ModelSerializer):

    display_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "name", "display_name", "created_at"]

    def get_display_name(self, obj):
        return f"(ID:{obj.id}) {obj.name}"


class BookSerializer(serializers.ModelSerializer):
    current_holder_name = serializers.SerializerMethodField()
    # qr_code = serializers.ImageField(read_only=True)
    qr_code = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = [
            "id",
            "book_id",
            "title",
            "author",
            "genre",
            "publication_year",
            "status",
            "current_holder",
            "current_holder_name",
            "qr_code",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["status", "current_holder", "qr_code", "created_at", "updated_at"]

    def get_current_holder_name(self, obj):
        # return obj.current_holder.name if obj.current_holder else None
        if obj.current_holder:
            return f"{obj.current_holder.name} (ID: {obj.current_holder.id})"
        return "Available"
    
    def get_qr_code(self, obj):
        return obj.get_qr_code()


class BorrowTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = BorrowTransaction
        fields = ["id", "book", "user", "issued_at", "returned_at"]
