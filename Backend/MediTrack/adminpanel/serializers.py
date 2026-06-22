from rest_framework import serializers
from accounts.models import User


class AdminProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "role",
        ]

        read_only_fields = [
            "id",
            "username",
            "role",
        ]