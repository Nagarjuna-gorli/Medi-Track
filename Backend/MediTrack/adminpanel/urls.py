from django.urls import path
from .views import AdminProfileView, AdminDashboardStatsView

urlpatterns = [
    path(
        "profile/",
        AdminProfileView.as_view(),
        name="admin-profile"
    ),

    path(
        "dashboard-stats/",
        AdminDashboardStatsView.as_view(),
        name="admin-dashboard-stats"
    ),
]