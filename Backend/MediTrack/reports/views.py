from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied,ValidationError
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Report
from .serializers import ReportSerializer
from appointments.models import Appointment

from notifications.services import notify  
from doctors.models import Doctor
from appointments.models import Appointment 


class ReportViewSet(viewsets.ModelViewSet):
    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated]

    # =========================
    # LIST
    # =========================
    def get_queryset(self):
        user = self.request.user

        if user.role == "admin":
            return Report.objects.all().select_related(
                "patient__user",
                "doctor__user"
            )

        elif user.role == "doctor":
            return Report.objects.filter(
                doctor=user.doctor
            ).select_related(
                "patient__user",
                "doctor__user"
            )

        elif user.role == "patient":
            return Report.objects.filter(
                patient=user.patient
            ).select_related(
                "doctor__user"
            )

        return Report.objects.none()

    # =========================
    # CREATE REPORT
    # =========================
   

    def perform_create(self, serializer):
        user = self.request.user

        patient = serializer.validated_data["patient"]

        # ---------------------------
        # STEP 1: RESOLVE DOCTOR
        # ---------------------------
        if user.role == "doctor":
            doctor = user.doctor

        elif user.role == "admin":
            doctor_id = self.request.data.get("doctor")

            if not doctor_id:
                raise ValidationError({"doctor": "Doctor is required"})

            try:
                doctor = Doctor.objects.get(id=doctor_id)
            except Doctor.DoesNotExist:
                raise ValidationError({"doctor": "Invalid doctor"})

        else:
            raise PermissionDenied("Not allowed")

        # ---------------------------
        # STEP 2: CHECK COMPLETED APPOINTMENT
        # ---------------------------
        exists = Appointment.objects.filter(
            doctor=doctor,
            patient=patient,
            status="completed"
        ).exists()

        if not exists:
            raise PermissionDenied(
                "This patient has no completed appointment with selected doctor"
            )

        # ---------------------------
        # STEP 3: SAVE REPORT
        # ---------------------------
        report = serializer.save(doctor=doctor)

        # ---------------------------
        # STEP 4: NOTIFICATION
        # ---------------------------
        notify(
            user=report.patient.user,
            title="Medical Report Uploaded",
            message="A new medical report has been uploaded",
            notif_type="report",
            action="create",
            reference_id=report.id
        )

    # =========================
    # UPDATE REPORT
    # =========================

    def perform_update(self, serializer):

        user = self.request.user
        report = self.get_object()

        # -----------------------
        # DOCTOR RULE
        # -----------------------
        if user.role == "doctor":
            if not hasattr(user, "doctor") or report.doctor != user.doctor:
                raise PermissionDenied("You cannot edit this report")

        # -----------------------
        # ADMIN RULE
        # -----------------------
        elif user.role == "admin":
            pass  # admin can edit anything

        else:
            raise PermissionDenied("Not allowed")

        # save update
        report = serializer.save()

        notify(
            user=report.patient.user,
            title="Medical Report Updated",
            message="Your report has been updated",
            notif_type="report",
            action="update",
            reference_id=report.id
        )
    # =========================
    # DELETE REPORT
    # =========================
    def perform_destroy(self, instance):

        if self.request.user.role == "doctor":

            if instance.doctor != self.request.user.doctor:
                raise PermissionDenied(
                    "You cannot delete this report"
                )

        elif self.request.user.role != "admin":

            raise PermissionDenied(
                "Not allowed"
            )

        notify(
            user=instance.patient.user,
            title="Medical Report Removed",
            message="A medical report was deleted",
            notif_type="report",
            action="delete",
            reference_id=instance.id
        )

        instance.delete()



    @action(detail=False, methods=["get"])
    def doctors(self, request):

        doctors = Doctor.objects.select_related("user")

        data = []

        for doctor in doctors:

            data.append({
                "id": doctor.id,
                "doctor_name": doctor.user.username
            })

        return Response(data)
        

    

    @action(detail=False, methods=["get"])
    def completed_patients(self, request):

        user = request.user

        doctor_id = request.query_params.get("doctor")

        # -----------------------------
        # CASE 1: DOCTOR LOGGED IN
        # -----------------------------
        if hasattr(user, "doctor"):
            doctor_id = user.doctor.id

        # -----------------------------
        # CASE 2: ADMIN MUST PROVIDE doctor_id
        # -----------------------------
        elif not doctor_id:
            return Response([])

        appointments = Appointment.objects.filter(
            doctor_id=doctor_id,
            status="completed"
        ).select_related("patient__user")

        seen = set()
        patients = []

        for appointment in appointments:
            patient = appointment.patient

            if patient.id not in seen:
                seen.add(patient.id)
                patients.append({
                    "id": patient.id,
                    "patient_name": patient.user.username
                })

        return Response(patients)