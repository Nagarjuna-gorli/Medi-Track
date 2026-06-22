from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HealthStatusViewSet

router = DefaultRouter()
router.register(r"", HealthStatusViewSet, basename="healthstatus")

urlpatterns = [
    path("", include(router.urls)),

    path(
        "doctor-patients/",
        HealthStatusViewSet.as_view(
            {"get": "doctor_patients"}
        ),
        name="doctor-patients"
    ),

    path(
        "my-appointment-patients/",
        HealthStatusViewSet.as_view(
            {"get": "my_appointment_patients"}
        ),
        name="my-appointment-patients"
    ),
]