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