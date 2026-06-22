from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Notification
        fields = [
            "id",
            "user",
            "user_name",
            "title",
            "message",
            "notification_type",
            "action",
            "reference_id",
            "is_read",
            "created_at",
        ]
        read_only_fields = ["user", "created_at"]