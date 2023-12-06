from django.contrib.auth.models import Group
from app import models
from rest_framework import serializers

class GroupSerializer(serializers.ModelSerializer):    
    class Meta:
        model = Group
        fields = ['name']

class UserSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(many=True)

    class Meta:
        model = models.CustomUser
        fields = ['id', 'public_key', 'groups']

class RoomSerializer(serializers.ModelSerializer):

    players = UserSerializer(many=True, read_only=True)
    created_by = UserSerializer(read_only=True)
    winner = UserSerializer(read_only=True)
    created_by =  UserSerializer(read_only=True)
    invited_players = UserSerializer(many=True, read_only=True)  # Use many=True for many-to-many relationships

    class Meta:
        model = models.Room
        fields = '__all__'

class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Module
        fields = ['id','name', 'url', 'groups', 'submodules']

    def to_representation(self, instance):
        
        groups = self.context.get("groups")

        ret = super().to_representation(instance)
        ret['groups'] = GroupSerializer(instance.groups, many=True).data
        ret['submodules'] = ModuleSerializer(instance.submodules.filter(groups__in=groups).distinct().order_by('id'), many=True).data
        return ret