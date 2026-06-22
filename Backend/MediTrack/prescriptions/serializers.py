from rest_framework import serializers
from .models import Prescription
from appointments.models import Appointment


class PrescriptionSerializer(serializers.ModelSerializer):

    doctor_name = serializers.CharField(
        source="doctor.user.username",
        read_only=True
    )

    patient_name = serializers.CharField(
        source="patient.user.username",
        read_only=True
    )

    class Meta:
        model = Prescription
        fields = [
            "id",
            "doctor",
            "patient",
            "doctor_name",
            "patient_name",
            "medicine",
            "dosage",
            "instructions",
            "created_at",
        ]

        read_only_fields = [
            "doctor_name",
            "patient_name",
            "created_at",
        ]

    # 🔥 VALIDATION (ONLY COMPLETED APPOINTMENTS)
    # 🔥 VALIDATION
    def validate(self, data):
        user = self.context["request"].user

        if user.role not in ["doctor", "admin"]:
            raise serializers.ValidationError(
                "Only doctors or admins can manage prescriptions"
            )

        # Skip validation while updating
        if self.instance:
            return data

        patient = data.get("patient")
        doctor = data.get("doctor")

        if user.role == "doctor":
            doctor = user.doctor

        if not Appointment.objects.filter(
            doctor=doctor,
            patient=patient,
            status="completed"
        ).exists():
            raise serializers.ValidationError(
                "Prescription allowed only after completed appointment"
            )

        return data