from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from doctors.models import Doctor
from patients.models import Patient
from appointments.models import Appointment


class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = {
            "total_doctors": Doctor.objects.count(),
            "total_patients": Patient.objects.count(),
            "total_appointments": Appointment.objects.count(),

            "pending_appointments": Appointment.objects.filter(
                status="pending"
            ).count(),

            "confirmed_appointments": Appointment.objects.filter(
                status="confirmed"
            ).count(),

            "completed_appointments": Appointment.objects.filter(
                status="completed"
            ).count(),
        }

        return Response(data)


class DoctorDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            doctor = request.user.doctor

            data = {
                "doctor_name": doctor.user.username,

                "total_patients": Patient.objects.filter(
                    appointments__doctor=doctor
                ).distinct().count(),

                "total_appointments": Appointment.objects.filter(
                    doctor=doctor
                ).count(),

                "pending_appointments": Appointment.objects.filter(
                    doctor=doctor,
                    status="pending"
                ).count(),

                "completed_appointments": Appointment.objects.filter(
                    doctor=doctor,
                    status="completed"
                ).count(),
            }

            return Response(data)

        except Doctor.DoesNotExist:
            return Response(
                {"error": "Doctor profile not found"},
                status=404
            )


class PatientDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            patient = request.user.patient

            data = {
                "patient_name": patient.user.username,

                "total_appointments": Appointment.objects.filter(
                    patient=patient
                ).count(),

                "pending_appointments": Appointment.objects.filter(
                    patient=patient,
                    status="pending"
                ).count(),

                "completed_appointments": Appointment.objects.filter(
                    patient=patient,
                    status="completed"
                ).count(),
            }

            return Response(data)

        except Patient.DoesNotExist:
            return Response(
                {"error": "Patient profile not found"},
                status=404
            )