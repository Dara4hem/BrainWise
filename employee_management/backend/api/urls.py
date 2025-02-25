from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, CompanyViewSet, DepartmentViewSet, EmployeeViewSet,
    MyTokenObtainPairView, get_user_data, employee_report, chat_with_bot
)
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'companies', CompanyViewSet, basename='company')
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r'employees', EmployeeViewSet, basename='employee')

urlpatterns = [
    path('api/employees/report/', employee_report, name='employee_report'),
    path('api/', include(router.urls)),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/user/', get_user_data, name='get_user_data'), 
    path("chatbot/", chat_with_bot, name="chatbot"),
]
