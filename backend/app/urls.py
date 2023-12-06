from django.urls import path, include
from app import views_users, views_rooms, views, init_db
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token

router = routers.DefaultRouter()

urlpatterns = [
    
    # init db
    path('init_db/', init_db.init_db, name='init_db'),

    # initial info
    path('initial_info/', views.initial_info, name='initial_info'),

    # user endpoints
    path('logout/', views_users.logout, name='api_token_logout'),
    path('create_login_user', views_users.create_login_user, name='create_login_user'), 
    
    # room endpoints
    path('room/create_room', views_rooms.create_room, name='create_room'), 
    path('room/edit_room/<id>', views_rooms.edit_room, name='edit_room'), 
    path('room/search_rooms', views_rooms.search_rooms, name='search_rooms'), 
    path('room/search_personal_rooms', views_rooms.search_personal_rooms, name='search_personal_rooms'), 
    path('room/view/<int:id>', views_rooms.view_room, name='view'),


]
 