from django.db import models
from django.conf import settings

class Doctor(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='doctor'
    )

    specialization = models.CharField(max_length=100)
    phone = models.CharField(max_length=15, blank=True)

    # ✅ NEW FIELDS
    hospital_name = models.CharField(max_length=150, blank=True)
    hospital_address = models.TextField(blank=True)

    GENDER_CHOICES = [
        ("male", "Male"),
        ("female", "Female"),
        ("other", "Other"),
    ]

    BLOOD_GROUP_CHOICES = [
        ("A+", "A+"), ("A-", "A-"),
        ("B+", "B-"), ("B-", "B-"),
        ("AB+", "AB-"),
        ("O+", "O-"),
    ]

    gender = models.CharField(
        max_length=10,
        choices=GENDER_CHOICES,
        blank=True
    )

    dob = models.DateField(null=True, blank=True)

    blood_group = models.CharField(
        max_length=5,
        choices=BLOOD_GROUP_CHOICES,
        blank=True
    )

    def __str__(self):
        return self.user.get_full_name() or self.user.username