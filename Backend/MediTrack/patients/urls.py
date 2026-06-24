from django.urls import path
from .views import PatientViewSet, PatientProfileView,PatientDashboardStatsView

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'', PatientViewSet, basename='patients')

urlpatterns = [
    path("profile/", PatientProfileView.as_view(), name="patient-profile"),
    path(
        "dashboard-stats/",
        PatientDashboardStatsView.as_view(),
        name="patient-dashboard-stats"
    ),
]

urlpatterns += router.urls