from django.http import JsonResponse
from django.utils.translation import get_language_from_path
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions, status
from django.conf import settings
from django.contrib.auth.models import Group, Permission, PermissionManager
from backend.models import CustomUser, Module
from django.db import transaction
from django.contrib.auth.models import Group
from backend.models import CustomUser, Room

management_permissions = [
    #log
    "Can add log entry",
    "Can change log entry",
    "Can delete log entry",
    "Can view log entry",
    #group
    "Can add group",
    "Can change group",
    "Can delete group",
    "Can view group",
    #permission
    "Can add permission",
    "Can change permission",
    "Can delete permission",
    "Can view permission",
    #token
    "Can add multi token",
    "Can change multi token",
    "Can delete multi token",
    "Can view multi token",
    #module
    "Can add module",
    "Can change module",
    "Can delete module",
    "Can view module",
    #notification
    "Can add notification",
    "Can change notification",
    "Can delete notification",
    "Can view notification",
    #user
    "Can add user",
    "Can change user",
    "Can delete user",
    "Can view user",
    #session
    "Can add content type",
    "Can change content type",
    "Can delete content type",
    "Can view content type",
    "Can add session",
    "Can change session",
    "Can delete session",
    "Can view session"
]

def create_groups_permissions():
    print("*************** GROUP MANAGEMENT *******************")

    management_group, created = Group.objects.get_or_create(name=settings.ROLE_MANAGEMENT)

    user_group, created = Group.objects.get_or_create(name=settings.ROLE_USER)

    print("*************** MANAGEMENT PERMISSIONS *******************")

    # for p in management_permissions:
    #     permission = Permission.objects.get(name=p)
    #     management_group.permissions.add(permission)


def create_users():
    print("*************** ADDING TESTING USERS *******************")

    managment_group = Group.objects.get(name=settings.ROLE_MANAGEMENT)

    print("*************** ADDING MANAGEMENT *******************")

    management1 = CustomUser(username="management1", first_name="Management", last_name="Uno", public_key="Uno")
    management1.set_password("management1")
    management1.save()
    management1.groups.add(managment_group)
    # Create some CustomUser objects
    user1 = CustomUser.objects.create_user(username='user1', password='password1', public_key='0x5B38Da6a701c568545dCfcB03FcB875f56beddC4')
    user2 = CustomUser.objects.create_user(username='user2', password='password2', public_key='0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2')
    user3 = CustomUser.objects.create_user(username='user3', password='password3', public_key='0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db')

    # Create some Room objects
    room1 = Room.objects.create(game='Chess', created_by=user1, status='Open', public=True, tickets=2)
    room2 = Room.objects.create(game='Chess', created_by=user2, status='Closed', public=False, tickets=3)
    room3 = Room.objects.create(game='Chess', created_by=user3, status='Playing', public=True, tickets=1)

    # Add players and invited players to a room
    room1.players.add(user1, user3)
    room1.invited_players.add(user2)
    array = room1.players_ready
    array.append(True)
    array.append(True)
    room1.players_ready = array
    room1.save()

    # Add players and invited players to a room
    room2.players.add(user2, user3)
    room2.invited_players.add(user1)
    array = room2.players_ready
    array.append(True)
    array.append(True)
    room2.players_ready = array

    # Set winner for a room
    room2.winner = user1
    room2.save()

    room3.players.add(user1,user2,user3)
    array = room3.players_ready
    array.append(True)
    array.append(True)
    array.append(True)
    room3.players_ready = array
    room3.save()


    # Create more CustomUser objects
    user4 = CustomUser.objects.create_user(username='user4', password='password4', public_key='0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB')
    user5 = CustomUser.objects.create_user(username='user5', password='password5', public_key='0x617F2E2fD72FD9D5503197092aC168c91465E7f2')
    user6 = CustomUser.objects.create_user(username='user6', password='password6', public_key='0x17F6AD8Ef982297579C203069C1DbfFE4348c372')

    # Create more Room objects
    room4 = Room.objects.create(game='Chess', created_by=user4, status='Open', public=True, tickets=2)
    room5 = Room.objects.create(game='Chess', created_by=user5, status='Closed', public=False, tickets=3)
    room6 = Room.objects.create(game='Chess', created_by=user6, status='Closed', public=True, tickets=1)

    # Add players and invited players to a room
    room4.players.add(user4, user6)
    room4.invited_players.add(user5)
    array = room4.players_ready
    array.append(True)
    array.append(True)
    room4.players_ready = array
    room4.save()

    room5.players.add(user5,user6)
    room5.invited_players.add(user4,user3)
    array = room5.players_ready
    array.append(True)
    array.append(True)
    room5.players_ready = array
    room5.winner = user6
    room5.save()

    room6.players.add(user6,user2,user5)
    room6.invited_players.add(user4, user6)
    array = room6.players_ready
    array.append(True)
    array.append(True)
    array.append(True)
    room6.players_ready = array

    room6.winner = user5
    room6.save()

    # Create more CustomUser objects
    user7 = CustomUser.objects.create_user(username='user7', password='password7', public_key='0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678')
    user8 = CustomUser.objects.create_user(username='user8', password='password8', public_key='0x03C6FcED478cBbC9a4FAB34eF9f40767739D1Ff7')
    user9 = CustomUser.objects.create_user(username='user9', password='password9', public_key='0x1aE0EA34a72D944a8C7603FfB3eC30a6669E454C')
    user10 = CustomUser.objects.create_user(username='user10', password='password10', public_key='0x0A098Eda01Ce92ff4A4CCb7A4fFFb5A43EBC70DC')

    # Create more Room objects
    room7 = Room.objects.create(game='Chess', created_by=user7, status='Closed', public=True, tickets=2)
    room8 = Room.objects.create(game='Chess', created_by=user8, status='Closed', public=False, tickets=3)
    room9 = Room.objects.create(game='Chess', created_by=user9, status='Playing', public=True, tickets=1)
    room10 = Room.objects.create(game='Chess', created_by=user10, status='Closed', public=True, tickets=1)

    # Add players and invited players to a room
    room7.players.add(user7, user9)
    room7.invited_players.add(user8)
    array = room7.players_ready
    array.append(True)
    array.append(True)
    room7.players_ready = array
    room7.winner = user9
    room7.save()

    room8.players.add(user8, user10)
    room8.invited_players.add(user9)
    array = room8.players_ready
    array.append(True)
    array.append(True)
    room8.players_ready = array
    room8.winner = user10
    room8.save()

    room9.players.add(user9, user8)
    room9.invited_players.add(user7)
    array = room9.players_ready
    array.append(True)
    array.append(True)
    room9.players_ready = array
    room9.save()

    room10.players.add(user7, user8, user10)
    room10.invited_players.add(user9)
    room10.invited_players.add(user1)
    array = room10.players_ready
    array.append(True)
    array.append(True)
    array.append(True)
    room10.players_ready = array
    room10.save()

    # Create more CustomUser objects
    user11 = CustomUser.objects.create_user(username='user11', password='password11', public_key='0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c')
    user12 = CustomUser.objects.create_user(username='user12', password='password12', public_key='0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C')
    user13 = CustomUser.objects.create_user(username='user13', password='password13', public_key='0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB')
    testing_us = CustomUser(username='testing_us', password='password14', public_key='0x5F3d1e523bd953D9b1275e5404A0E6DA871B16d8')
    testing_us.set_password("uwu")
    testing_us.save()
    testing_us.groups.add(managment_group)

    # Create more Room objects
    room11 = Room.objects.create(game='Chess', created_by=user11, status='Open', public=False, tickets=2)
    room12 = Room.objects.create(game='Chess', created_by=user12, status='Closed', public=False, tickets=3)
    room13 = Room.objects.create(game='Chess', created_by=user13, status='Open', public=True, tickets=1)
    room14 = Room.objects.create(game='Chess', created_by=testing_us, status='Closed', public=True, tickets=1)
    room15 = Room.objects.create(game='Chess', created_by=testing_us, status='Open', public=False, tickets=1)
    room16 = Room.objects.create(game='Chess', created_by=testing_us, status='Open', public=True, tickets=5)
    room17 = Room.objects.create(game='Chess', created_by=testing_us, status='Open', public=True, tickets=20)

    # Add players and invited players to a room
    room11.players.add(user11, user13)
    room11.invited_players.add(testing_us)
    array = room11.players_ready
    array.append(True)
    array.append(True)
    room11.players_ready = array
    room11.save()

    room12.players.add(user12, testing_us)
    room12.invited_players.add(user1)
    array = room12.players_ready
    array.append(True)
    array.append(False)
    room12.players_ready = array
    room12.winner = testing_us
    room12.save()

    room13.players.add(testing_us, user13)
    room13.invited_players.add(user11)
    array.append(True)
    array = room13.players_ready
    array.append(False)
    room13.players_ready = array
    room13.save()

    room14.players.add(testing_us, user12)
    room14.invited_players.add(user13, user11)
    array = room14.players_ready
    array.append(True)
    array.append(False)
    room14.players_ready = array

    room14.winner = testing_us
    room14.save()

    room15.players.add(testing_us, user5)
    room15.invited_players.add(user9, user11)
    array = room15.players_ready
    array.append(True)
    array.append(False)
    room15.players_ready = array
    room15.save()

    room16.players.add(testing_us, user12)
    room16.invited_players.add(user9, user11)
    array = room16.players_ready
    array.append(True)
    array.append(False)
    room16.players_ready = array
    room16.save()

    room17.players.add(testing_us, user8)
    room17.invited_players.add(user1, user11)
    array = room17.players_ready
    array.append(True)
    array.append(False)
    room17.players_ready = array
    room17.save()



def create_modules(modules, parent_module):
    print("*************** ADDING MODULES *******************")
    
    created_modules = []

    for module in modules:
        m = Module(name=module['name'], url=module['url'], parent_module=parent_module)
        m.save()
        created_modules.append(m)
        for group in module['groups']:
            g = Group.objects.get(name=group)
            m.groups.add(g)
        if 'submodules' in module:
            create_modules(module['submodules'], m)
    
    return created_modules

@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def init_db(request):
    try:
        with transaction.atomic():
            update_modules = request.query_params.get('update_modules', None) #?update_modules=true
            if update_modules:
                Module.objects.all().delete()
                create_modules(settings.MODULES, None)
                print("*************** MODULES UPDATED *******************")
                return JsonResponse({"response": "modules updated"}, status=status.HTTP_200_OK)
            else:
                create_groups_permissions()
                create_modules(settings.MODULES, None)
                create_testing_data = request.query_params.get('create_testing_data', None) #?create_testing_data=true
                if create_testing_data:
                    create_users()
                print("*************** INITIAL DATA FINISHED *******************")
                return JsonResponse({"response": "data created"}, status=status.HTTP_200_OK)
    except Exception as e:
        return JsonResponse({"error": "failed, not created", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)