from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    DoctorViewSet,
    DoctorProfileView,
    DoctorDashboardStatsView
)

router = DefaultRouter()
router.register(r'', DoctorViewSet, basename='doctor')

urlpatterns = [
    path(
        "profile/",
        DoctorProfileView.as_view(),
        name="doctor-profile"
    ),

    path(
        "dashboard-stats/",
        DoctorDashboardStatsView.as_view(),
        name="doctor-dashboard-stats"
    ),
]

urlpatterns += router.urls