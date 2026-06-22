from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Notification
from .serializers import NotificationSerializer


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == "admin":
            return Notification.objects.all().order_by("-created_at")

        if user.role == "doctor":
            return Notification.objects.filter(
                user=user,
                notification_type="appointment"
            ).order_by("-created_at")

        if user.role == "patient":
            return Notification.objects.filter(
                user=user
            ).order_by("-created_at")

        return Notification.objects.none()

    # =========================
    # CREATE NOTIFICATION
    # =========================
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)