from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied

from .models import Patient
from .serializers import PatientSerializer


class PatientViewSet(viewsets.ModelViewSet):
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # 🟢 ADMIN → all patients
        if user.role == "admin":
            return Patient.objects.all()

        # 🟡 PATIENT → only own record
        if user.role == "patient":
            return Patient.objects.filter(user=user)

        # 🔵 DOCTOR → ONLY patients with COMPLETED appointments
        if user.role == "doctor":
            return Patient.objects.filter(
                appointments__doctor__user=user,
                appointments__status="completed"
            ).distinct()

        return Patient.objects.none()
    
    def perform_destroy(self, instance):
        if self.request.user.role != "admin":
            raise PermissionDenied(
                "Only admin can delete patients"
            )

        # Delete User + Patient permanently
        instance.user.delete()


class PatientProfileView(APIView):
    permission_classes = [IsAuthenticated]

    # GET PROFILE
    def get(self, request):
        try:
            patient = Patient.objects.get(user=request.user)
            return Response(PatientSerializer(patient).data)
        except Patient.DoesNotExist:
            return Response({"error": "Patient not found"}, status=404)

    # UPDATE PROFILE
    def put(self, request):
        try:
            patient = Patient.objects.get(user=request.user)

            serializer = PatientSerializer(
                patient,
                data=request.data,
                partial=True
            )

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)

            return Response(serializer.errors, status=400)

        except Patient.DoesNotExist:
            return Response({"error": "Patient not found"}, status=404)
        

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from appointments.models import Appointment
from prescriptions.models import Prescription
from reports.models import Report


class PatientDashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != "patient":
            return Response(
                {"detail": "Only patients can access this endpoint"},
                status=403
            )

        patient = request.user.patient

        appointments = Appointment.objects.filter(
            patient=patient
        ).count()

        upcoming = Appointment.objects.filter(
            patient=patient,
            status="pending"  
        ).count()

        prescriptions = Prescription.objects.filter(
            patient=patient
        ).count()

        reports = Report.objects.filter(
            patient=patient
        ).count()


        return Response({
            "appointments": appointments,
            "upcoming": upcoming,
            "prescriptions": prescriptions,
            "reports": reports,
        
        })