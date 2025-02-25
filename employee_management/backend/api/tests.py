from django.test import TestCase
from django.contrib.auth import get_user_model
from api.models import Company, Department, Employee
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class EmployeeWorkflowTests(TestCase):
    def setUp(self):
        self.company = Company.objects.create(name="Test Company")
        self.department = Department.objects.create(name="Test Department", company=self.company)
        self.user = User.objects.create_user(
            username="employee1", password="testpass", role="employee", email="emp1@test.com"
        )
        self.employee = Employee.objects.create(
            user=self.user,
            company=self.company,
            department=self.department,
            designation="Developer",
            status="application_received"
        )

    def test_valid_transition_application_received_to_interview_scheduled(self):
        self.employee.change_status("interview_scheduled")
        self.employee.refresh_from_db()
        self.assertEqual(self.employee.status, "interview_scheduled")

    def test_invalid_transition_application_received_to_hired(self):
        with self.assertRaises(ValueError):
            self.employee.change_status("hired")

    def test_terminal_state_no_transition(self):
        self.employee.status = "hired"
        self.employee.save()
        with self.assertRaises(ValueError):
            self.employee.change_status("not_accepted")



class EmployeeWorkflowAPITests(APITestCase):
    def setUp(self):
        self.company = Company.objects.create(name="Integration Company")
        self.department = Department.objects.create(name="Integration Department", company=self.company)
        self.user = User.objects.create_user(
            username="employee2", password="testpass", role="employee", email="emp2@test.com"
        )
        self.employee = Employee.objects.create(
            user=self.user,
            company=self.company,
            department=self.department,
            designation="Tester",
            status="application_received"
        )
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")

    def test_change_status_api_valid(self):
        url = reverse('employee-detail', kwargs={'pk': self.employee.pk})
        change_url = url + "change-status/"
        data = {"status": "interview_scheduled"}
        response = self.client.patch(change_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], "interview_scheduled")

    def test_change_status_api_invalid(self):
        url = reverse('employee-detail', kwargs={'pk': self.employee.pk})
        change_url = url + "change-status/"
        data = {"status": "hired"}  
        response = self.client.patch(change_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
