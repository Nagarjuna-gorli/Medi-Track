from django.db import models
from doctors.models import Doctor
from patients.models import Patient


class Appointment(models.Model):

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
        ("doctor_cancelled", "Doctor Cancelled"),
        ("patient_cancelled", "Patient Cancelled"),
    ]

    # 👇 Proper relationships (VERY IMPORTANT)
    doctor = models.ForeignKey(
        Doctor,
        on_delete=models.CASCADE,
        related_name="appointments"
    )

    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name="appointments"
    )

    # 👇 Better than DateField (you need time also)
    appointment_date = models.DateTimeField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    reason = models.TextField(blank=True, null=True)
    
    doctor_deleted = models.BooleanField(default=False)
    patient_deleted = models.BooleanField(default=False)

    notes = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-appointment_date"]

    def __str__(self):
        return f"{self.patient} → {self.doctor} ({self.appointment_date})"