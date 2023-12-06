from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser, Group
from rest_framework.authtoken.models import Token
from django.contrib.postgres.fields import ArrayField

class CustomUser(AbstractUser):
    public_key = models.CharField(max_length=100, unique=True)
    REQUIRED_FIELDS = ['public_key']

class MultiToken(Token):
    # key is no longer primary key, but still indexed and unique
    key = models.CharField(max_length=40, db_index=True, unique=True)
    # relation to user is a ForeignKey, so each user can have more than one token
    user = models.ForeignKey(CustomUser, related_name='auth_tokens', on_delete=models.CASCADE)
    
    class Meta:
        unique_together = (('user','key'),)

class Module(models.Model):
    name = models.CharField(max_length=200)
    url = models.CharField(max_length=200)
    groups = models.ManyToManyField(Group, related_name="groups", blank=False)
    parent_module = models.ForeignKey('self', related_name="submodules", on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.name   

class Room(models.Model):

    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='created_rooms')
    created_at = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=10, default='Open')
    public = models.BooleanField(default=False)
    tickets = models.IntegerField(default=1)
    players = models.ManyToManyField(CustomUser, related_name='played_rooms')
    winner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, related_name='won_rooms')
    invited_players = models.ManyToManyField(CustomUser, related_name='invited_at_room')
    game = models.CharField(max_length=100, null=True)
    players_ready = ArrayField(models.CharField(max_length=100), default=list)  # This adds the ArrayField
    ready_smart_contract =  models.BooleanField(default=False)
    all_players_ready_from_smart_contract =  models.BooleanField(default=False)



