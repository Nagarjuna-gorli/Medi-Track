from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model

from doctors.models import Doctor
from patients.models import Patient

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # 👇 stored inside JWT token (frontend can decode it)
        token["role"] = user.role
        token["username"] = user.username

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        # 👇 returned to frontend login API response
        data["role"] = self.user.role
        data["username"] = self.user.username

        return data
    
class RegisterSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(choices=["patient", "doctor"])
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ["username", "email", "password", "role"]

    def create(self, validated_data):
        role = validated_data.pop("role")
        password = validated_data.pop("password")

        # ✅ create user safely
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=password,
            role=role
        )

        # 👇 auto-create profile based on role
        if role == "doctor":
            Doctor.objects.create(
                user=user,
                specialization="General"
            )

        elif role == "patient":
            Patient.objects.create(
                user=user,
                age=0
            )

        return user
    
from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "role"]


