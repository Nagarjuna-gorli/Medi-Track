from rest_framework import serializers
from .models import Doctor


class DoctorSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.CharField(source="user.email", read_only=True)
    is_active = serializers.BooleanField(
        source="user.is_active",
        read_only=True
    )
    

    class Meta:
        model = Doctor
        fields = [
            "id",
            "username",
            "email",
            "specialization",
            "phone",
            "hospital_name",
            "hospital_address",

            # NEW FIELDS
            "gender",
            "dob",
            "blood_group",
            "is_active",
        ]