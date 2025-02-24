from rest_framework import serializers
from .models import User, Employee, Company, Department




class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'company')

class EmployeeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # ✅ تضمين بيانات المستخدم المرتبطة

    class Meta:
        model = Employee
        fields = ('id', 'user', 'company', 'department', 'designation', 'status')


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name']


class DepartmentSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source="company.name", read_only=True)

    class Meta:
        model = Department
        fields = ['id', 'name', 'company', 'company_name']



class EmployeeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # ✅ تضمين بيانات المستخدم المرتبطة

    class Meta:
        model = Employee
        fields = ('id', 'user', 'company', 'department', 'designation', 'status')



    def create(self, validated_data):
        user_id = validated_data.pop('user_id')  # ✅ جلب معرف المستخدم الحالي
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise serializers.ValidationError({"user_id": "User not found."})

        if user.role != 'employee':  # ✅ التأكد من أن المستخدم هو موظف فقط
            raise serializers.ValidationError({"user_id": "User must have an 'employee' role."})

        employee = Employee.objects.create(user=user, **validated_data)
        return employee
