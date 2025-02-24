from rest_framework import viewsets
from django.urls import path
from .models import User, Company, Department, Employee
from .serializers import UserSerializer, CompanySerializer, DepartmentSerializer, EmployeeSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response



from rest_framework.decorators import action
# ✅ API لجلب بيانات المستخدم
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_data(request):
    user = request.user
    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "company": user.company.name if user.company else "Not assigned"
    })

# ✅ تخصيص التوكن وإضافة معلومات إضافية
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["email"] = user.email
        token["role"] = "admin" if user.is_superuser else "manager" if user.groups.filter(name="Managers").exists() else "employee"
        return token

    def validate(self, attrs):
        login_field = attrs.get("username")
        password = attrs.get("password")

        if not login_field or not password:
            raise serializers.ValidationError({"error": "Both username/email and password are required."})

        user = None
        if "@" in login_field:
            try:
                user = User.objects.get(email=login_field)
            except User.DoesNotExist:
                raise serializers.ValidationError({"error": "Invalid email or password."})
        else:
            try:
                user = User.objects.get(username=login_field)
            except User.DoesNotExist:
                raise serializers.ValidationError({"error": "Invalid username or password."})

        if not user.check_password(password):
            raise serializers.ValidationError({"error": "Invalid credentials."})

        attrs["username"] = user.username
        return super().validate(attrs)

# ✅ تخصيص View الخاصة بتسجيل الدخول
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# ✅ `User ViewSet`
class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return User.objects.all()
        elif user.role == 'manager':
            return User.objects.filter(company=user.company)
        elif user.role == 'employee':
            return User.objects.filter(id=user.id)
        return User.objects.none()





# ✅ `Company ViewSet`
class CompanyViewSet(viewsets.ModelViewSet):
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]
    queryset = Company.objects.all()
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Company.objects.all()
        elif user.role == 'manager':
            return Company.objects.filter(id=user.company.id)
        return Company.objects.none()




# ✅ `Department ViewSet`
class DepartmentViewSet(viewsets.ModelViewSet):
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]
    queryset = Department.objects.all()
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Department.objects.all()
        elif user.role == 'manager':
            return Department.objects.filter(company=user.company)
        return Department.objects.none()


# ✅ `Employee ViewSet`
class EmployeeViewSet(viewsets.ModelViewSet):
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Employee.objects.all()  # ✅ Admin يمكنه رؤية الجميع
        elif user.role == 'manager':
            return Employee.objects.filter(company=user.company)  # ✅ Manager يرى موظفي شركته فقط
        elif user.role == 'employee':
            return Employee.objects.filter(user=user)  # ✅ Employee يرى بياناته فقط
        return Employee.objects.none() # ❌ منع الوصول للبيانات إن لم يكن لديه صلاحيات




