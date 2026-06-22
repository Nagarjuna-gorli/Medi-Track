from django.urls import path
from .views import DoctorViewSet, DoctorProfileView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'', DoctorViewSet, basename='doctor')

urlpatterns = [
    path("profile/", DoctorProfileView.as_view(), name="doctor-profile"),
]

urlpatterns += router.urls