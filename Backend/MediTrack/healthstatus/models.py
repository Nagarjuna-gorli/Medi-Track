from django.db import models
from django.conf import settings


class HealthStatus(models.Model):

    STATUS_CHOICES = [
        ("stable", "Stable"),
        ("improving", "Improving"),
        ("critical", "Critical"),
        ("under_observation", "Under Observation"),
    ]

    doctor = models.ForeignKey(
    "doctors.Doctor",
    on_delete=models.CASCADE,
    related_name="health_records"
)

    patient = models.ForeignKey(
        "patients.Patient",
        on_delete=models.CASCADE,
        related_name="health_records"
    )

    condition = models.CharField(max_length=100, default="normal")
    description = models.TextField(null=True, blank=True)

    blood_pressure = models.CharField(max_length=20, blank=True, null=True)
    sugar_level = models.CharField(max_length=20, blank=True, null=True)
    temperature = models.CharField(max_length=10, blank=True, null=True)

    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default="stable"
    )

    notes = models.TextField(blank=True, null=True)

    recorded_date = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-recorded_date"]

    def __str__(self):
        return f"{self.patient.user.username} - {self.status}"  