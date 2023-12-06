from distutils.log import error
from django.http import JsonResponse
from django.db import transaction
from app.models import CustomUser, MultiToken, Group
from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.hashers import make_password
from app.serializers import UserSerializer
from app import authentication
from app.utils import error_log, manage_exception
import random
import string
from django.conf import settings

def generate_random_string(length):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for _ in range(length))

def generate_unique_username():
    while True:
        username = generate_random_string(8)  # Generate an 8-character random string
        if not CustomUser.objects.filter(username=username).exists():
            return username

def generate_unique_email():
    while True:
        email = generate_random_string(10) + '@example.com'  # Generate a random email
        if not CustomUser.objects.filter(email=email).exists():
            return email

def generate_random_password():
    password = generate_random_string(10)  # Generate a 10-character random string
    return password


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_details(request):
    user_info = {
        'username': request.user.username,  # `django.contrib.auth.User` instance.
        'token': str(request.auth),  # None
        'id': request.user.id,
        'first_name': request.user.first_name,
        'last_name': request.user.last_name,
        'public_key': request.user.public_key
    }
    return JsonResponse(user_info)

# Use the generated values in the create_user endpoint
@api_view(["POST"])
@permission_classes([permissions.AllowAny])  # here we specify permission by default we set IsAuthenticated
def create_login_user(request):
    try:
        if 'public_key' not in request.data:
            return JsonResponse({'msg': 'Not getting all the info'}, status=status.HTTP_400_BAD_REQUEST)

        user = CustomUser.objects.filter(public_key=request.data['public_key']).first()
        if user is None:
            with transaction.atomic():
                username = generate_unique_username()
                password = make_password(generate_random_password())
                first_name = ''
                last_name = ''
                email = generate_unique_email()

                with transaction.atomic():
                    user = CustomUser(
                        username=username,
                        password=password,
                        first_name=first_name,
                        last_name=last_name,
                        email=email,
                        public_key=request.data['public_key']
                    )

                    user.save()

                    user.groups.add(Group.objects.filter(name=settings.ROLE_MANAGEMENT).first())
                    user.save()
        # Me traigo el token asociado a un usuario o creo uno nuevo.
        token =  MultiToken.objects.filter(user=user).first()
        if token is None:
            token = MultiToken.objects.create(user = user)
        
        #token_expire_handler will check, if the token is expired it will generate new one
        is_expired, token = authentication.token_expire_handler(token)
        user_serialized = UserSerializer(user)


        return JsonResponse({
            'public_key': user_serialized.data['public_key'], 
            'expires_in': authentication.expires_in(token).total_seconds(),
            'token': token.key,
            'groups': user_serialized.data['groups'],
            'id': user.id
        }, status=status.HTTP_200_OK)

    except:
        error_log('create_user', True)
        manage_exception(request)
        return JsonResponse({'msg': 'Error at creating user'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def logout(request):
    try:
        token = MultiToken.objects.get(key = request.auth.key)
        token.delete()
        
        return JsonResponse({}, status=status.HTTP_200_OK)
    except Exception as e:
        manage_exception(request, e)
        return JsonResponse({ 'error': 'token does not exist' }, status = status.HTTP_400_BAD_REQUEST)

