from django.conf import settings
from rest_framework import permissions
from .utils import user_has_group_in_action, user_has_group_in_module

class CheckActionPermissionForUser(permissions.BasePermission):

    permission = ""

    def __init__(self, permission):
        super().__init__()
        self.permission = permission

    def __call__(self):
        return self
    
    def has_permission(self, request, view):

        modules_actions_permissions = []

        if isinstance(self.permission, list):    
            for p in self.permission:
                if p in settings.MODULES_ACTIONS_PERMISSIONS:
                    modules_actions_permissions += settings.MODULES_ACTIONS_PERMISSIONS[p]
                    
        elif self.permission in settings.MODULES_ACTIONS_PERMISSIONS:
            modules_actions_permissions = settings.MODULES_ACTIONS_PERMISSIONS[self.permission] 

        return user_has_group_in_action(request.user, modules_actions_permissions)

class CheckModulePermissionForUser(permissions.BasePermission):

    permission = ""

    def __init__(self, permission):
        super().__init__()
        self.permission = permission

    def __call__(self):
        return self
    
    def has_permission(self, request, view):

        if isinstance(self.permission, list):
            for p in self.permission:
                if user_has_group_in_module(request.user, p):
                    return True
            return False
        else:
            return user_has_group_in_module(request.user, self.permission)