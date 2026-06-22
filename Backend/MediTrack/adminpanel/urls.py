from django.urls import path
from .views import AdminProfileView

urlpatterns = [
    path(
        "profile/",
        AdminProfileView.as_view(),
        name="admin-profile"
    ),
]