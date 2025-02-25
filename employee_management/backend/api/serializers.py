from rest_framework import serializers
from .models import User, Employee, Company, Department

class UserSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'phone_number', 'role', 'company')

class EmployeeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True) 

    class Meta:
        model = Employee
        fields = ('id', 'user', 'user_id', 'company', 'department', 'designation', 'status', 'hired_on')

    def validate(self, data):
        company = data.get('company')
        department = data.get('department')
        if department and company and department.company != company:
            raise serializers.ValidationError("The selected department does not belong to the specified company.")
        return data

    def create(self, validated_data):
        user_id = validated_data.pop('user_id')
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise serializers.ValidationError({"user_id": "User not found."})
        if user.role != 'employee':
            raise serializers.ValidationError({"user_id": "User must have an 'employee' role."})
        employee = Employee.objects.create(user=user, **validated_data)
        return employee

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name']

class DepartmentSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source="company.name", read_only=True)

    class Meta:
        model = Department
        fields = ['id', 'name', 'company', 'company_name']

class EmployeeReportSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source="company.name", read_only=True)
    department_name = serializers.CharField(source="department.name", read_only=True)
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Employee
        fields = ('id', 'username', 'company_name', 'department_name', 'designation', 'status')
