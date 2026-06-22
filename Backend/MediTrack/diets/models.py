from django.db import models
from doctors.models import Doctor
from patients.models import Patient


class DietPlan(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)

    title = models.CharField(max_length=200)
    description = models.TextField()

    morning = models.TextField(blank=True, null=True)
    afternoon = models.TextField(blank=True, null=True)
    dinner = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.patient} - {self.title}"