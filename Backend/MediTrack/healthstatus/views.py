from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import HealthStatus
from .serializers import HealthStatusSerializer
from appointments.models import Appointment

from notifications.services import notify   # ✅ ADD THIS


class HealthStatusViewSet(viewsets.ModelViewSet):
    serializer_class = HealthStatusSerializer
    permission_classes = [IsAuthenticated]

    # =========================
    # LIST VIEW
    # =========================
    def get_queryset(self):
        user = self.request.user

        if user.role == "admin":
            return HealthStatus.objects.select_related(
                "doctor__user",
                "patient__user"
            )

        if user.role == "doctor":
            return HealthStatus.objects.filter(
                doctor=user.doctor
            ).select_related(
                "doctor__user",
                "patient__user"
            )

        if user.role == "patient":
            return HealthStatus.objects.filter(
                patient=user.patient
            ).select_related(
                "doctor__user",
                "patient__user"
            )

        return HealthStatus.objects.none()

    # =========================
    # CREATE
    # =========================
    def perform_create(self, serializer):
        user = self.request.user

        # DOCTOR CREATE
        if user.role == "doctor":

            patient = serializer.validated_data["patient"]

            if not Appointment.objects.filter(
                doctor=user.doctor,
                patient=patient,
                status="completed"
            ).exists():
                raise PermissionDenied("No completed appointment")

            health = serializer.save(
                doctor=user.doctor
            )

        # ADMIN CREATE
        elif user.role == "admin":

            doctor = serializer.validated_data["doctor"]
            patient = serializer.validated_data["patient"]

            if not Appointment.objects.filter(
                doctor=doctor,
                patient=patient,
                status="completed"
            ).exists():
                raise PermissionDenied(
                    "Patient has no completed appointment with this doctor"
                )

            health = serializer.save()

        else:
            raise PermissionDenied(
                "Only doctor or admin can create"
            )

        notify(
            user=health.patient.user,
            title="Health Status Created",
            message="Your health status has been recorded",
            notif_type="health_status",
            action="create",
            reference_id=health.id
        )
    # =========================
    # UPDATE
    # =========================
    def perform_update(self, serializer):
        user = self.request.user

        if user.role == "doctor":

            if serializer.instance.doctor != user.doctor:
                raise PermissionDenied("Not your record")

        elif user.role != "admin":
            raise PermissionDenied(
                "Only doctor or admin can update"
            )

        health = serializer.save()

        notify(
            user=health.patient.user,
            title="Health Status Updated",
            message="Your health status has been updated",
            notif_type="health_status",
            action="update",
            reference_id=health.id
        )

    # =========================
    # DELETE
    # =========================
    def perform_destroy(self, instance):
        user = self.request.user

        if user.role == "doctor":

            if instance.doctor != user.doctor:
                raise PermissionDenied("Not your record")

        elif user.role != "admin":
            raise PermissionDenied(
                "Only doctor or admin can delete"
            )

        notify(
            user=instance.patient.user,
            title="Health Status Removed",
            message="Your health status record was deleted",
            notif_type="health_status",
            action="delete",
            reference_id=instance.id
        )

        instance.delete()


    # =========================
    # COMPLETED APPOINTMENT PATIENTS
    # =========================
    @action(detail=False, methods=["get"], url_path="my-appointment-patients")
    def my_appointment_patients(self, request):
        user = request.user

        if user.role != "doctor":
            return Response({"error": "Only doctors allowed"}, status=403)

        appointments = Appointment.objects.filter(
            doctor=user.doctor,
            status="completed"
        ).select_related("patient__user")

        data = []
        seen = set()

        for app in appointments:
            if app.patient.id not in seen:
                seen.add(app.patient.id)

                data.append({
                    "id": app.patient.id,
                    "patient_name": app.patient.user.username,
                })

        return Response(data)
    

    @action(
    detail=False,
    methods=["get"],
    url_path="doctor-patients"
)
    def doctor_patients(self, request):

        if request.user.role != "admin":
            return Response(
                {"error": "Only admin allowed"},
                status=403
            )

        doctor_id = request.query_params.get("doctor")

        if not doctor_id:
            return Response(
                {"error": "doctor id required"},
                status=400
            )

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
                    "patient_name": app.patient.user.username
                })

        return Response(data)
    

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        print(serializer.data)

        return Response(serializer.data)