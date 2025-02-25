import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
import django
django.setup()


from api.models import Company, Department, Employee, User

user = User.objects.filter(username="testemp").first()
if not user:
    user = User.objects.create_user(
        username="testemp",
        password="testpass",
        role="employee",
        email="test@example.com"
    )

try:
    employee = Employee.objects.get(user=user)
except Employee.DoesNotExist:
    company = Company.objects.first() or Company.objects.create(name="Test Company")
    department = Department.objects.first() or Department.objects.create(name="Test Department", company=company)
    employee = Employee.objects.create(
        user=user,
        company=company,
        department=department,
        designation="Developer",
        status="application_received"
    )

employee.change_status("interview_scheduled")
