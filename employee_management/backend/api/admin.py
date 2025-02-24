from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Employee, Company, Department

# ✅ تخصيص عرض المستخدمين في Django Admin
class CustomUserAdmin(UserAdmin):
    list_display = ('id', 'username', 'email', 'role', 'company')  # ✅ عرض البيانات المهمة
    list_filter = ('role', 'company')  # ✅ تصفية حسب الدور والشركة
    search_fields = ('username', 'email')  # ✅ إمكانية البحث بسهولة
    ordering = ('id',)  # ✅ ترتيب المستخدمين حسب ID

    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Personal Info', {'fields': ('role', 'company')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'role', 'company', 'password1', 'password2'),
        }),
    )

# ✅ تخصيص عرض الموظفين في Django Admin
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'company', 'department', 'designation', 'status')
    list_filter = ('company', 'department', 'status')
    search_fields = ('user__username', 'user__email', 'designation')

# ✅ تخصيص عرض الشركات
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

# ✅ تخصيص عرض الأقسام
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'company')
    search_fields = ('name', 'company__name')

# ✅ تسجيل الموديلات مع Django Admin
admin.site.register(User, CustomUserAdmin)
admin.site.register(Employee, EmployeeAdmin)
admin.site.register(Company, CompanyAdmin)
admin.site.register(Department, DepartmentAdmin)
