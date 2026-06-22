from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied

from .models import Appointment
from .serializers import AppointmentSerializer
from doctors.models import Doctor
from patients.models import Patient
from notifications.services import notify

from django.contrib.auth import get_user_model

User = get_user_model()
class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    # ======================
    # LIST FILTERING
    # ======================
    def get_queryset(self):
        user = self.request.user

        if user.role == "admin":
            return Appointment.objects.all()

        if user.role == "doctor":
            return Appointment.objects.filter(
                doctor__user=user,
                doctor_deleted=False
            )

        if user.role == "patient":
            return Appointment.objects.filter(
                patient__user=user,
                patient_deleted=False
            )

        return Appointment.objects.none()

    # ======================
    # OBJECT SECURITY
    # ======================
    def get_object(self):
        obj = super().get_object()
        user = self.request.user

        if user.role == "admin":
            return obj

        if user.role == "doctor" and obj.doctor.user == user:
            return obj

        if user.role == "patient" and obj.patient.user == user:
            return obj

        raise PermissionDenied("Not allowed")

    # ======================
    # CREATE APPOINTMENT
    # ======================
    def perform_create(self, serializer):
        user = self.request.user

        # =====================
        # PATIENT BOOKING
        # =====================
        if user.role == "patient":

            appointment = serializer.save(
                patient=user.patient
            )

            notify(
                user=appointment.doctor.user,
                title="New Appointment Booked",
                message=f"{appointment.patient.user.username} booked an appointment",
                notif_type="appointment",
                action="create",
                reference_id=appointment.id
            )

        # =====================
        # ADMIN BOOKING
        # =====================
        elif user.role == "admin":

            appointment = serializer.save(
                doctor_id=self.request.data.get("doctor"),
                patient_id=self.request.data.get("patient"))
            

            notify(
                user=appointment.doctor.user,
                title="Appointment Created By Admin",
                message=f"Appointment booked for {appointment.patient.user.username}",
                notif_type="appointment",
                action="create",
                reference_id=appointment.id
            )

            notify(
                user=appointment.patient.user,
                title="Appointment Booked",
                message="Admin booked an appointment for you",
                notif_type="appointment",
                action="create",
                reference_id=appointment.id
            )

        else:
            raise PermissionDenied(
                "Only patient or admin can create appointments"
            )

    # ======================
    # UPDATE APPOINTMENT
    # ======================
    def perform_update(self, serializer):
        appointment = self.get_object()
        old_status = appointment.status

        # ------------------
        # PATIENT UPDATE RULES
        # ------------------
        if self.request.user.role == "patient":

            if appointment.patient.user != self.request.user:
                raise PermissionDenied(
                    "Not your appointment"
                )

            # Allow editing only while pending
            if appointment.status != "pending":
                raise PermissionDenied(
                    "Only pending appointments can be updated"
                )

        if self.request.user.role == "patient":
            updated = serializer.save(
                doctor=appointment.doctor,
                patient=appointment.patient,
                status=appointment.status,
                notes=appointment.notes,
            )
        else:
            updated = serializer.save()

        # ------------------
        # PATIENT UPDATED
        # ------------------
        if self.request.user.role == "patient":

            notify(
                user=updated.doctor.user,
                title="Appointment Updated",
                message=f"{updated.patient.user.username} updated appointment details",
                notif_type="appointment",
                action="update",
                reference_id=updated.id
            )

        # ------------------
        # DOCTOR UPDATED
        # ------------------
        elif self.request.user.role == "doctor":

            notify(
                user=updated.patient.user,
                title="Appointment Updated",
                message="Doctor updated your appointment",
                notif_type="appointment",
                action="update",
                reference_id=updated.id
            )

            # Confirmed
            if (
                old_status != "confirmed"
                and updated.status == "confirmed"
            ):
                notify(
                    user=updated.patient.user,
                    title="Appointment Confirmed",
                    message="Doctor confirmed your appointment",
                    notif_type="appointment",
                    action="confirm",
                    reference_id=updated.id
                )

            # Completed
            if (
                old_status != "completed"
                and updated.status == "completed"
            ):
                notify(
                    user=updated.patient.user,
                    title="Appointment Completed",
                    message="Doctor marked your appointment as completed",
                    notif_type="appointment",
                    action="complete",
                    reference_id=updated.id
                )

            # Cancelled
            if (
                old_status != "doctor_cancelled"
                and updated.status == "doctor_cancelled"
            ):
                notify(
                    user=updated.patient.user,
                    title="Appointment Cancelled",
                    message="Doctor cancelled your appointment",
                    notif_type="appointment",
                    action="cancel",
                    reference_id=updated.id
                )

        # ------------------
        # ADMIN UPDATED
        # ------------------
        elif self.request.user.role == "admin":

            notify(
                user=updated.patient.user,
                title="Appointment Updated",
                message="Admin updated your appointment",
                notif_type="appointment",
                action="update",
                reference_id=updated.id
            )

            # Confirmed
            if (
                old_status != "confirmed"
                and updated.status == "confirmed"
            ):
                notify(
                    user=updated.patient.user,
                    title="Appointment Confirmed",
                    message="Admin confirmed your appointment",
                    notif_type="appointment",
                    action="confirm",
                    reference_id=updated.id
                )

            # Completed
            if (
                old_status != "completed"
                and updated.status == "completed"
            ):
                notify(
                    user=updated.patient.user,
                    title="Appointment Completed",
                    message="Admin marked your appointment as completed",
                    notif_type="appointment",
                    action="complete",
                    reference_id=updated.id
                )

            # Cancelled
            if (
                old_status != "doctor_cancelled"
                and updated.status == "doctor_cancelled"
            ):
                notify(
                    user=updated.patient.user,
                    title="Appointment Cancelled",
                    message="Admin cancelled your appointment",
                    notif_type="appointment",
                    action="cancel",
                    reference_id=updated.id
                )
                
    # ======================
    # DELETE APPOINTMENT
    # ======================
    def perform_destroy(self, instance):

        notify(
            user=instance.patient.user,
            title="Appointment Deleted",
            message="Your appointment has been removed",
            notif_type="appointment",
            action="delete",
            reference_id=instance.id
        )

        instance.delete()

    # ======================
    # PATIENT CANCEL
    # ======================

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        appointment = self.get_object()

        if request.user.role != "patient":
            return Response(
                {"error": "Only patient can cancel"},
                status=403
            )

        appointment.status = "patient_cancelled"
        appointment.save()

        # Notify Doctor
        notify(
            user=appointment.doctor.user,
            title="Appointment Cancelled",
            message=f"{appointment.patient.user.username} cancelled appointment",
            notif_type="appointment",
            action="cancel",
            reference_id=appointment.id
        )

        # Notify All Admins
        admins = User.objects.filter(role="admin")

        for admin in admins:
            notify(
                user=admin,
                title="Appointment Cancelled",
                message=f"{appointment.patient.user.username} cancelled appointment",
                notif_type="appointment",
                action="cancel",
                reference_id=appointment.id
            )

        return Response({
            "message": "Appointment cancelled successfully"
        })

    # ======================
    # DOCTOR STATUS UPDATE
    # ======================
    @action(detail=True, methods=["post"])
    def update_status(self, request, pk=None):
        print("UPDATE_STATUS CALLED")

        appointment = self.get_object()
        print("PATIENT:", appointment.patient.user.username)

        # Only doctor/admin
        if request.user.role not in ["doctor", "admin"]:
            return Response(
                {"error": "Only doctor or admin can update"},
                status=403
            )

        # Doctor can update only own appointments
        if (
            request.user.role == "doctor"
            and appointment.doctor.user != request.user
        ):
            return Response(
                {"error": "Not your appointment"},
                status=403
            )

        # Patient cancelled appointments are locked forever
        if appointment.status == "patient_cancelled":
            return Response(
                {
                    "error":
                    "Patient cancelled appointment cannot be updated"
                },
                status=400
            )

        status_value = request.data.get("status")

        allowed = [
            "confirmed",
            "completed",
            "doctor_cancelled"
        ]

        if status_value not in allowed:
            return Response(
                {"error": "Invalid status"},
                status=400
            )

        # -----------------------------
        # ADMIN RULES
        # -----------------------------
        if request.user.role == "admin":

            # Confirm
            if status_value == "confirmed":
                if appointment.status not in [
                    "pending",
                    "doctor_cancelled"
                ]:
                    return Response(
                        {
                            "error":
                            "Only pending or doctor-cancelled appointments can be confirmed"
                        },
                        status=400
                    )

            # Complete
            elif status_value == "completed":
                if appointment.status != "confirmed":
                    return Response(
                        {
                            "error":
                            "Only confirmed appointments can be completed"
                        },
                        status=400
                    )

            # Cancel
            elif status_value == "doctor_cancelled":
                if appointment.status not in [
                    "pending",
                    "confirmed"
                ]:
                    return Response(
                        {
                            "error":
                            "Only pending or confirmed appointments can be cancelled"
                        },
                        status=400
                    )

        # -----------------------------
        # DOCTOR RULES
        # -----------------------------
        elif request.user.role == "doctor":

            if status_value == "completed":
                if appointment.status != "confirmed":
                    return Response(
                        {
                            "error":
                            "Only confirmed appointments can be completed"
                        },
                        status=400
                    )

        old_status = appointment.status

        appointment.status = status_value
        appointment.save()

        # -----------------------------
        # NOTIFICATIONS
        # -----------------------------

        if status_value == "confirmed":

            confirmed_by = (
                "Admin"
                if request.user.role == "admin"
                else "Doctor"
            )

            # Re-open cancelled appointment
            if old_status == "doctor_cancelled":

                notify(
                    user=appointment.patient.user,
                    title="Appointment Reopened",
                    message=f"{confirmed_by} reopened and confirmed your appointment",
                    notif_type="appointment",
                    action="confirm",
                    reference_id=appointment.id
                )

            else:

                notify(
                    user=appointment.patient.user,
                    title="Appointment Confirmed",
                    message=f"{confirmed_by} confirmed your appointment",
                    notif_type="appointment",
                    action="confirm",
                    reference_id=appointment.id
                )

        elif status_value == "completed":

            completed_by = (
                "Admin"
                if request.user.role == "admin"
                else "Doctor"
            )

            notify(
                user=appointment.patient.user,
                title="Appointment Completed",
                message=f"{completed_by} marked your appointment as completed",
                notif_type="appointment",
                action="complete",
                reference_id=appointment.id
            )

        elif status_value == "doctor_cancelled":

            cancelled_by = (
                "Admin"
                if request.user.role == "admin"
                else "Doctor"
            )

            notify(
                user=appointment.patient.user,
                title="Appointment Cancelled",
                message=f"{cancelled_by} cancelled your appointment",
                notif_type="appointment",
                action="cancel",
                reference_id=appointment.id
            )

        return Response({
            "message": f"Appointment {status_value}"
        }) 

    #  ================
    # SOFT DELETE HISTORY
    # ======================
    @action(detail=True, methods=["post"])
    def delete_history(self, request, pk=None):

        appointment = self.get_object()

        if request.user.role == "doctor":

            appointment.doctor_deleted = True

            notify(
                user=appointment.patient.user,
                title="Appointment Removed",
                message="Doctor removed appointment from history",
                notif_type="appointment",
                action="delete",
                reference_id=appointment.id
            )

        elif request.user.role == "patient":

            appointment.patient_deleted = True

        else:
            return Response(
                {"error": "Not allowed"},
                status=403
            )

        appointment.save()

        return Response({
            "message": "Removed from history"
        })
    


    @action(detail=False, methods=["get"])
    def doctors(self, request):

        doctors = Doctor.objects.select_related("user")

        return Response([
            {
                "id": doctor.id,
                "doctor_name": doctor.user.username
            }
            for doctor in doctors
        ])
    


    @action(detail=False, methods=["get"])
    def patients(self, request):

        patients = Patient.objects.select_related("user")

        return Response([
            {
                "id": patient.id,
                "patient_name": patient.user.username
            }
            for patient in patients
        ])