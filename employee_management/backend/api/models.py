from django.contrib.auth.models import AbstractUser
from django.db import models

# ✅ 1. نموذج الشركات (Company Model)
class Company(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name

# ✅ 2. نموذج المستخدم (User Model)
class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('employee', 'Employee'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='employee')
    company = models.ForeignKey(Company, on_delete=models.SET_NULL, null=True, blank=True, related_name="users")

    def __str__(self):
        return self.username

# ✅ 3. نموذج الأقسام (Department Model)
class Department(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="departments")
    name = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.name} - {self.company.name}"

# ✅ 4. نموذج الموظفين (Employee Model)
class Employee(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('hired', 'Hired'),
        ('not_accepted', 'Not Accepted'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="employee_profile")
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="employees")
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name="employees")
    designation = models.CharField(max_length=255)
    hired_on = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"{self.user.username} - {self.designation}"
