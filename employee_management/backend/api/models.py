from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import date
import logging

logger = logging.getLogger(__name__)

class Company(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('employee', 'Employee'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='employee')
    company = models.ForeignKey(Company, on_delete=models.SET_NULL, null=True, blank=True, related_name="users")
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    
    def __str__(self):
        return self.username

class Department(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="departments")
    name = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.name} - {self.company.name}"

class Employee(models.Model):
    STATUS_CHOICES = [
        ('application_received', 'Application Received'),
        ('interview_scheduled', 'Interview Scheduled'),
        ('hired', 'Hired'),
        ('not_accepted', 'Not Accepted'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="employee_profile")
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="employees")
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name="employees")
    designation = models.CharField(max_length=255)
    hired_on = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='application_received')

    @property
    def days_worked(self):
        if self.hired_on:
            return (date.today() - self.hired_on).days
        return 0

    def change_status(self, new_status):
        allowed_transitions = {
            'application_received': ['interview_scheduled', 'not_accepted'],
            'interview_scheduled': ['hired', 'not_accepted'],
        }
        if self.status in allowed_transitions:
            if new_status in allowed_transitions[self.status]:
                logger.info(f"Employee {self.user.username}: status changed from {self.status} to {new_status}")
                self.status = new_status
                self.save()
                return True
            else:
                logger.error(f"Employee {self.user.username}: invalid status transition from {self.status} to {new_status}")
                raise ValueError(f"Invalid status transition from {self.status} to {new_status}.")
        else:
            logger.error(f"Employee {self.user.username}: status {self.status} is terminal and cannot be changed")
            raise ValueError(f"Status {self.status} is terminal and cannot be changed.")

    def __str__(self):
        return f"{self.user.username} - {self.designation}"
