from django.db import models

# Create your models here.

from django.db import models
from doctors.models import Doctor
from patients.models import Patient

class Prescription(models.Model):
    doctor = models.ForeignKey(
    Doctor,
    on_delete=models.CASCADE,
    null=True,
    blank=True)
   
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)

    medicine = models.TextField()
    dosage = models.CharField(
    max_length=100,
    default="Not specified")
    instructions = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.patient} - {self.doctor}"