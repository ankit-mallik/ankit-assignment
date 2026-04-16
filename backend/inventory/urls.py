from rest_framework.routers import DefaultRouter
from .views import BookViewSet, UserViewSet

router = DefaultRouter()
router.register(r"books", BookViewSet, basename="book")
router.register(r"users", UserViewSet, basename="user")

urlpatterns = router.urls
