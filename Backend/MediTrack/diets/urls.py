from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DietPlanViewSet

router = DefaultRouter()

router.register(
    r"dietplans",
    DietPlanViewSet,
    basename="dietplans"
)

urlpatterns = [
    path("", include(router.urls)),
]