from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminOrReadOnly(BasePermission):
    """يسمح فقط للـ Admin بتعديل البيانات، والباقي يمكنهم القراءة فقط"""
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role == 'admin'

class IsManagerOrReadOnly(BasePermission):
    """يسمح للـ Manager برؤية الموظفين في شركته فقط"""
    def has_object_permission(self, request, view, obj):
        return request.user.role == 'manager' and obj.company == request.user.company

class IsEmployeeOnly(BasePermission):
    """يسمح للموظف فقط برؤية بياناته"""
    def has_object_permission(self, request, view, obj):
        return request.user.role == 'employee' and obj.id == request.user.id
