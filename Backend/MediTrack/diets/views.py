from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import DietPlan
from .serializers import DietPlanSerializer

from appointments.models import Appointment
from patients.models import Patient
from notifications.services import notify


class DietPlanViewSet(viewsets.ModelViewSet):
    serializer_class = DietPlanSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = DietPlan.objects.all()

        # SEARCH FILTERS
        patient = self.request.query_params.get("patient")
        doctor = self.request.query_params.get("doctor")
        date = self.request.query_params.get("date")

        if user.is_superuser:
            pass

        elif hasattr(user, "doctor"):
            queryset = queryset.filter(
                doctor=user.doctor
            )

        elif hasattr(user, "patient"):
            queryset = queryset.filter(
                patient=user.patient
            )

        else:
            return DietPlan.objects.none()

        if patient:
            queryset = queryset.filter(
                patient__user__username__icontains=patient
            )

        if doctor:
            queryset = queryset.filter(
                doctor__user__username__icontains=doctor
            )

        if date:
            queryset = queryset.filter(
                created_at__date=date
            )

        return queryset.order_by("-created_at")

    # ====================================
    # ADMIN + DOCTOR PATIENTS
    # ====================================
    @action(detail=False, methods=["get"])
    def available_patients(self, request):

        doctor_id = request.query_params.get("doctor")

        if request.user.is_superuser:

            if not doctor_id:
                return Response([])

            patient_ids = Appointment.objects.filter(
                doctor_id=doctor_id,
                status="completed"
            ).values_list(
                "patient_id",
                flat=True
            )

        elif hasattr(request.user, "doctor"):

            patient_ids = Appointment.objects.filter(
                doctor=request.user.doctor,
                status="completed"
            ).values_list(
                "patient_id",
                flat=True
            )

        else:
            return Response([])

        patients = Patient.objects.filter(
            id__in=patient_ids
        ).distinct()

        return Response([
            {
                "id": p.id,
                "patient_name": p.user.username
            }
            for p in patients
        ])

    # ====================================
    # CREATE
    # ====================================
    def perform_create(self, serializer):

        user = self.request.user

        if user.is_superuser:

            doctor = serializer.validated_data.get(
                "doctor"
            )

            diet = serializer.save()

        elif hasattr(user, "doctor"):

            diet = serializer.save(
                doctor=user.doctor
            )

        else:
            raise PermissionDenied(
                "Only doctors/admin can create"
            )

        notify(
            user=diet.patient.user,
            title="New Diet Plan Created",
            message="Doctor created a diet plan",
            notif_type="diet_plan",
            action="create",
            reference_id=diet.id
        )

    # ====================================
    # UPDATE
    # ====================================
    def perform_update(self, serializer):

        user = self.request.user

        if not (
            user.is_superuser or
            hasattr(user, "doctor")
        ):
            raise PermissionDenied()

        diet = serializer.save()

        notify(
            user=diet.patient.user,
            title="Diet Plan Updated",
            message="Your diet plan updated",
            notif_type="diet_plan",
            action="update",
            reference_id=diet.id
        )

    # ====================================
    # DELETE
    # ====================================
    def perform_destroy(self, instance):

        user = self.request.user

        if not (
            user.is_superuser or
            hasattr(user, "doctor")
        ):
            raise PermissionDenied()

        notify(
            user=instance.patient.user,
            title="Diet Plan Deleted",
            message="Your diet plan removed",
            notif_type="diet_plan",
            action="delete",
            reference_id=instance.id
        )

        instance.delete()