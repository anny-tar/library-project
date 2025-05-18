from rest_framework.permissions import BasePermission

class IsReaderOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.reader.user == request.user

class IsLibrarian(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name='Librarians').exists()