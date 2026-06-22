from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Prescription
from .serializers import PrescriptionSerializer
from appointments.models import Appointment
from doctors.models import Doctor
from patients.models import Patient

from notifications.services import notify   # ✅ ADD THIS


class PrescriptionViewSet(viewsets.ModelViewSet):

    serializer_class = PrescriptionSerializer
    permission_classes = [IsAuthenticated]

    # =========================
    # LIST
    # =========================
    def get_queryset(self):
        user = self.request.user

        # ADMIN
        if user.role == "admin":
            return Prescription.objects.select_related(
                "doctor__user",
                "patient__user"
            ).order_by("-created_at")

        # DOCTOR
        if user.role == "doctor":
            return Prescription.objects.filter(
                doctor=user.doctor
            ).select_related(
                "patient__user"
            ).order_by("-created_at")

        # PATIENT
        if user.role == "patient":
            return Prescription.objects.filter(
                patient=user.patient
            ).select_related(
                "doctor__user"
            ).order_by("-created_at")

        return Prescription.objects.none()

    # =========================
    # CREATE
    # =========================
    def perform_create(self, serializer):
        user = self.request.user

        if user.role == "doctor":

            prescription = serializer.save(
                doctor=user.doctor
            )

        elif user.role == "admin":

            prescription = serializer.save()

        else:
            raise PermissionDenied(
                "Only doctors or admins can create prescriptions"
            )

        notify(
            user=prescription.patient.user,
            title="New Prescription Added",
            message="Your prescription has been created",
            notif_type="prescription",
            action="create",
            reference_id=prescription.id
        )

    # =========================
    # UPDATE
    # =========================
    def perform_update(self, serializer):
        user = self.request.user

        if user.role not in ["doctor", "admin"]:
            raise PermissionDenied("Only doctors can update")

        if (
        user.role == "doctor"
        and serializer.instance.doctor != user.doctor
        ):
            raise PermissionDenied("Not your prescription")

        prescription = serializer.save()

        # 🔔 NOTIFY PATIENT
        notify(
            user=prescription.patient.user,
            title="Prescription Updated",
            message="Your prescription was updated",
            notif_type="prescription",
            action="update",
            reference_id=prescription.id
        )

    # =========================
    # DELETE
    # =========================
    def perform_destroy(self, instance):
        user = self.request.user

        if user.role not in ["doctor", "admin"]:
            raise PermissionDenied("Only doctors can delete")

        if (
        user.role == "doctor"
        and instance.doctor != user.doctor
        ):
            raise PermissionDenied("Not your prescription")
            

        # 🔔 NOTIFY PATIENT BEFORE DELETE
        notify(
            user=instance.patient.user,
            title="Prescription Removed",
            message="Your prescription was deleted",
            notif_type="prescription",
            action="delete",
            reference_id=instance.id
        )

        instance.delete()

    # =========================
    # 🔥 COMPLETED APPOINTMENT PATIENTS
    # =========================
    @action(detail=False, methods=["get"], url_path="completed-patients")
    def completed_patients(self, request):
        user = request.user

        if user.role != "doctor":
            return Response({"error": "Only doctors allowed"}, status=403)

        appointments = Appointment.objects.filter(
            doctor=user.doctor,
            status="completed"
        ).select_related("patient__user")

        seen = set()
        data = []

        for app in appointments:
            if app.patient.id not in seen:
                seen.add(app.patient.id)

                data.append({
                    "id": app.patient.id,
                    "patient": app.patient.id,
                    "patient_name": app.patient.user.username,
                })

        return Response(data)
    


    @action(detail=False, methods=["get"])
    def doctor_patients(self, request):

        doctor_id = request.query_params.get("doctor")

        if not doctor_id:
            return Response([])

        appointments = Appointment.objects.filter(
            doctor_id=doctor_id,
            status="completed"
        ).select_related("patient__user")

        seen = set()
        data = []

        for app in appointments:
            if app.patient.id not in seen:
                seen.add(app.patient.id)

                data.append({
                    "id": app.patient.id,
                    "patient_name": app.patient.user.username,
                })

        return Response(data)