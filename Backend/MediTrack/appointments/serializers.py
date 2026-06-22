# appointments/serializers.py
from rest_framework import serializers
from .models import Appointment

class AppointmentSerializer(serializers.ModelSerializer):

    doctor_name = serializers.CharField(source="doctor.user.username", read_only=True)
    doctor_specialization = serializers.CharField(source="doctor.specialization", read_only=True)

    patient_name = serializers.CharField(source="patient.user.username", read_only=True)

    hospital_name = serializers.CharField(source="doctor.hospital_name", read_only=True)
    hospital_address = serializers.CharField(source="doctor.hospital_address", read_only=True)

    class Meta:
        model = Appointment

        fields = [
            "id",
            "doctor",
            "patient",

            "doctor_name",
            "doctor_specialization",
            "patient_name",

            "hospital_name",
            "hospital_address",

            "appointment_date",
            "reason",
            "notes",
            "status",

            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "patient",
            "created_at",
            "updated_at",
            "doctor_name",
            "doctor_specialization",
            "patient_name",
            "hospital_name",
            "hospital_address",
        ]

    def update(self, instance, validated_data):
        request = self.context.get("request")

        if request and request.user.role == "patient":

            # Patients can only edit these fields
            instance.appointment_date = validated_data.get(
                "appointment_date",
                instance.appointment_date
            )

            instance.reason = validated_data.get(
                "reason",
                instance.reason
            )

            instance.save()

            return instance

        return super().update(instance, validated_data)