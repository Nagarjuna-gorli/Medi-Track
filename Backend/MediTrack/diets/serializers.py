from rest_framework import serializers
from .models import DietPlan


class DietPlanSerializer(serializers.ModelSerializer):

    doctor_name = serializers.SerializerMethodField()
    patient_name = serializers.SerializerMethodField()

    class Meta:
        model = DietPlan
        fields = [
            "id",
            "doctor",
            "patient",
            "doctor_name",
            "patient_name",
            "title",
            "description",
            "morning",
            "afternoon",
            "dinner",
            "created_at",
        ]

        read_only_fields = [ "doctor","created_at","doctor_name","patient_name"]

    def get_doctor_name(self, obj):
        return obj.doctor.user.username if obj.doctor and obj.doctor.user else None

    def get_patient_name(self, obj):
        return obj.patient.user.username if obj.patient and obj.patient.user else None