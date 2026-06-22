from rest_framework import serializers
from .models import Report

class ReportSerializer(serializers.ModelSerializer):

    doctor_name = serializers.CharField(source="doctor.user.username", read_only=True)
    patient_name = serializers.CharField(source="patient.user.username", read_only=True)

    class Meta:
        model = Report
        fields = [
            "id",
            "doctor",
            "patient",
            "doctor_name",
            "patient_name",
            "title",
            "description",
            "file",
            "created_at"
        ]
        read_only_fields = ["created_at", "doctor_name", "patient_name"]