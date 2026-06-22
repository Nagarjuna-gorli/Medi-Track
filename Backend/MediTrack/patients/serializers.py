from rest_framework import serializers
from .models import Patient


class PatientSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.CharField(source="user.email", read_only=True)

    class Meta:
        model = Patient
        fields = [
            "id",
            "username",
            "email",
            "age",
            "phone",
            "address",

            # NEW FIELDS
            "gender",
            "dob",
            "blood_group",
        ]