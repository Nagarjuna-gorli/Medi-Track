from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Doctor
from .serializers import DoctorSerializer


class DoctorViewSet(viewsets.ModelViewSet):
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated]

    # -----------------------------
    # LIST / RETRIEVE
    # -----------------------------
    def get_queryset(self):
        user = self.request.user

        if user.role == "admin":
            return Doctor.objects.all()

        elif user.role == "doctor":
            return Doctor.objects.filter(user=user)

        elif user.role == "patient":
            return Doctor.objects.all()

        return Doctor.objects.none()

    # -----------------------------
    # CREATE
    # -----------------------------
    def perform_create(self, serializer):
        if self.request.user.role != "admin":
            raise PermissionDenied("Only admin can create doctors")

        serializer.save()

    # -----------------------------
    # UPDATE
    # -----------------------------
    def perform_update(self, serializer):
        user = self.request.user

        if user.role not in ["admin", "doctor"]:
            raise PermissionDenied("Not allowed")

        if user.role == "doctor" and serializer.instance.user != user:
            raise PermissionDenied(
                "You can only update your own profile"
            )

        serializer.save()

    # -----------------------------
    # DELETE
    # -----------------------------
    def perform_destroy(self, instance):
        if self.request.user.role != "admin":
            raise PermissionDenied(
                "Only admin can delete doctors"
            )

        instance.user.delete()

    # -----------------------------
    # DISABLE DOCTOR
    # -----------------------------
    @action(detail=True, methods=["patch"])
    def disable(self, request, pk=None):
        if request.user.role != "admin":
            raise PermissionDenied(
                "Only admin allowed"
            )

        doctor = self.get_object()

        doctor.user.is_active = False
        doctor.user.save()

        return Response({
            "message": "Doctor disabled successfully"
        })

    # -----------------------------
    # ENABLE DOCTOR
    # -----------------------------
    @action(detail=True, methods=["patch"])
    def enable(self, request, pk=None):
        if request.user.role != "admin":
            raise PermissionDenied(
                "Only admin allowed"
            )

        doctor = self.get_object()

        doctor.user.is_active = True
        doctor.user.save()

        return Response({
            "message": "Doctor enabled successfully"
        })


class DoctorProfileView(APIView):
    permission_classes = [IsAuthenticated]

    # -----------------------------
    # GET PROFILE
    # -----------------------------
    def get(self, request):
        doctor = Doctor.objects.get(user=request.user)

        return Response(
            DoctorSerializer(doctor).data
        )

    # -----------------------------
    # UPDATE PROFILE
    # -----------------------------
    def put(self, request):
        doctor = Doctor.objects.get(user=request.user)

        serializer = DoctorSerializer(
            doctor,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=400
        )
    

# doctors/views.py

from appointments.models import Appointment
from prescriptions.models import Prescription
from reports.models import Report
from notifications.models import Notification

from django.utils import timezone


class DoctorDashboardStatsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        doctor = request.user.doctor

        total_patients = Appointment.objects.filter(
            doctor=doctor,
            status="completed"
        ).values("patient").distinct().count()

        today_appointments = Appointment.objects.filter(
                doctor=doctor,
                appointment_date__date=timezone.localdate()
            ).exclude(
                status__in=[
                    "completed",
                    "doctor_cancelled",
                    "patient_cancelled"
                ]
            ).count()

        pending = Appointment.objects.filter(
            doctor=doctor,
            status="pending"
        ).count()

        completed = Appointment.objects.filter(
            doctor=doctor,
            status="completed"
        ).count()

        prescriptions = Prescription.objects.filter(
            doctor=doctor
        ).count()

        reports = Report.objects.filter(
            doctor=doctor
        ).count()

        notifications = Notification.objects.filter(
            user=request.user,
            is_read=False
        ).count()

        return Response({
            "patients": total_patients,
            "today": today_appointments,
            "pending": pending,
            "completed": completed,
            "prescriptions": prescriptions,
            "reports": reports,
            "notifications": notifications
        })