from django.http import JsonResponse
from app.models import CustomUser, Module
from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from app.serializers import  UserSerializer, ModuleSerializer
from django.conf import settings
from .utils import manage_exception, user_has_group_in_action

@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def initial_info(request):
    try:
        initial_info = dict()

        if "modules_actions_permissions" in request.data:    
            modules_actions_permissions_filtered = list(filter(lambda x: user_has_group_in_action(request.user, settings.MODULES_ACTIONS_PERMISSIONS[x]), settings.MODULES_ACTIONS_PERMISSIONS))
            initial_info["modules_actions_permissions"] = modules_actions_permissions_filtered

        if "modules" in request.data:
            groups = request.user.groups.all()
            modules = list(Module.objects.filter(groups__in=groups).filter(parent_module=None).distinct().order_by('id'))
            ModuleSerializer.context={'groups': groups}
            initial_info["modules"] = ModuleSerializer(modules, many=True).data

        if "users" in request.data:
            users = list(CustomUser.objects.all().order_by('-id'))
            initial_info["users"] = UserSerializer(users, many=True).data
        
        return JsonResponse({"initial_info": initial_info}, status=status.HTTP_200_OK)

    except Exception as e:
        manage_exception(request, e)
        return JsonResponse({'Error': str(e)})