from django.urls import path
from .views import PatientViewSet, PatientProfileView

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'', PatientViewSet, basename='patients')

urlpatterns = [
    path("profile/", PatientProfileView.as_view(), name="patient-profile"),
]

urlpatterns += router.urls