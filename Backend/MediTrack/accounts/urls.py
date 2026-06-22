from django.urls import path
from .views import RegisterView
from rest_framework_simplejwt.views import TokenRefreshView
from .views import CustomTokenObtainPairView,MeView

urlpatterns = [
    path("login/", CustomTokenObtainPairView.as_view()),
    path("refresh/", TokenRefreshView.as_view()),
    path("register/", RegisterView.as_view()),
    path("me/", MeView.as_view()),
]