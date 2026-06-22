from rest_framework import serializers
from .models import HealthStatus
from appointments.models import Appointment

class HealthStatusSerializer(serializers.ModelSerializer):

    patient_name = serializers.CharField(source="patient.user.username", read_only=True)
    doctor_name = serializers.CharField(source="doctor.user.username", read_only=True)

    class Meta:
        model = HealthStatus
        fields = "__all__"
        extra_kwargs = {
            "doctor": {"required": False},
        }

    def validate(self, data):

        request = self.context["request"]
        user = request.user

        patient = data.get("patient")
        doctor = data.get("doctor")

        if user.role == "doctor":
            doctor = user.doctor

        if user.role in ["doctor", "admin"]:

            if patient and doctor:

                if not Appointment.objects.filter(
                    doctor=doctor,
                    patient=patient,
                    status="completed"
                ).exists():

                    raise serializers.ValidationError(
                        "Only completed appointment patients allowed"
                    )

        return data