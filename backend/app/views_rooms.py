from distutils.log import error
from django.http import JsonResponse
from django.contrib.auth.models import  Group
from django.conf import settings
from django.db import transaction
from app import serializers
from app.models import Room, CustomUser
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from app.utils import error_log, manage_exception
from rest_framework import permissions, status
from django.db import models as dmodels
from datetime import datetime
from django.db.models import Q



@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def create_room(request):
    try:
        if ( 'public' in request.data
            and 'players' in request.data
            and 'amount' in request.data
            and 'user_public_key' in request.data
            and 'game' in request.data
        ):
            
            user = CustomUser.objects.get(public_key=request.data['user_public_key'])

            users = CustomUser.objects.filter(public_key__in=request.data['players']).distinct()

            with transaction.atomic():
                
                room = Room(
                    created_by= user,
                    public= request.data['public'],
                    tickets = request.data['amount'],
                    game= request.data['game']
                )

                room.save()
                room.players.add(user)
                
                for x in users:
                    room.invited_players.add(x)

                serialized_room = serializers.RoomSerializer(room).data

            return JsonResponse({'data': serialized_room, 'msj': 'The room has been created'}, status=status.HTTP_200_OK)
        
        else:
            return JsonResponse({ 'error': 'The values given to filter the elements were not correct' }, status = status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        manage_exception(request, e)
        return JsonResponse({'error': str(e)}, status = status.HTTP_400_BAD_REQUEST)
    
@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def edit_room(request, id):
    try:
        if ( 'invited_players' in request.data
            and 'players' in request.data
            and 'user_public_key' in request.data
            and 'status' in request.data
            and 'public' in request.data
            and 'winner' in request.data
            and 'delete' in request.data
            and 'ready' in request.data
            and 'leave' in request.data 
            and 'ready_smart_contract' in request.data
            and 'all_players_ready_from_smart_contract' in request.data
        ):
            
            with transaction.atomic():
            
                room = Room.objects.filter(id=id).first()

                if room is None:
                    return JsonResponse({'msg': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)
                
                if request.data['delete'] is not None and request.data['delete'] != '':
                    room.delete()
                    return JsonResponse({'msg' : 'The room has been deleted succesfully'}, status=status.HTTP_200_OK)

                if request.data['status'] is not None and request.data['status'] != '':
                    room.status = request.data['status'] 
                
                if request.data['leave'] is not None and request.data['leave'] != '':
                    not_leave = CustomUser.objects.filter(public_key__in=request.data['leave'])
                    room.players.set(not_leave) 
                    for x in range(0,len(room.players_ready)):
                        if room.players_ready[x] == 'True':
                            room.players_ready[x] = False
                            break

                if request.data['public'] is not None and request.data['public'] != '':
                    room.public = request.data['public']
                
                if request.data['players'] is not None and request.data['players'] != '':

                    players = CustomUser.objects.filter(public_key=request.data['players']).first()
                    room.players.add(players)
                    array = room.players_ready
                    array.append(False)
                    room.players_ready = array

                if request.data['invited_players'] is not None and request.data['invited_players'] != '':
                    invited_players = CustomUser.objects.filter(public_key__in=request.data['invited_players'])
                    room.invited_players.set(invited_players)

                if request.data['ready'] is not None and request.data['ready'] != '':
                    all_ready = True
                    for x in range(0,len(room.players_ready)):
                        if room.players_ready[x] == 'False':
                            room.players_ready[x] = True
                            all_ready = False
                            break
                    if all_ready:
                        room.status = 'Playing'

                if request.data['winner'] is not None and request.data['winner'] != '':
                    winner = CustomUser.objects.filter(public_key=request.data['winner']).first()
                    if winner:
                        room.winner = winner                                                        
                        room.status = 'Closed'
                    else:
                        return JsonResponse({'msg': 'Winner not found'}, status=status.HTTP_400_BAD_REQUEST)
                
                if request.data['ready_smart_contract'] is not None and request.data['ready_smart_contract'] != '':
                    room.ready_smart_contract = True
                
                if request.data['all_players_ready_from_smart_contract'] is not None and request.data['all_players_ready_from_smart_contract'] != '':
                    room.all_players_ready_from_smart_contract = True

                room.save()
                
                serialized_room = serializers.RoomSerializer(room).data

            return JsonResponse({'data' :serialized_room}, status=status.HTTP_200_OK)
        
        else:
            return JsonResponse({ 'error': 'The values given were not correct' }, status = status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        error_log('edit_room', True)
        manage_exception(request, e)
        return JsonResponse({'msg': 'edit_room'}, status = status.HTTP_400_BAD_REQUEST)
    
def filter_rooms(request):
    if ( 'order_by' in request.data
            and 'order' in request.data
            and 'date_since' in request.data
            and 'date_until' in request.data
            and 'owner' in request.data
            and 'public' in request.data
            and 'status' in request.data
            and 'winner' in request.data
            and 'player' in request.data
            and 'amount' in request.data
            and 'user_public_key' in request.data
            and 'game' in request.data
        ):
            date_since = None

            date_until = None

            if request.data['date_until']:
                parsed_date = datetime.strptime(request.data['date_until'], "%Y-%m-%dT%H:%M:%S.%fZ")
                date_until = parsed_date.strftime("%Y-%m-%d")  # Format as YYYY-MM-DD
            if request.data['date_since']:
                parsed_date = datetime.strptime(request.data['date_since'], "%Y-%m-%dT%H:%M:%S.%fZ")
                date_since = parsed_date.strftime("%Y-%m-%d")  # Format as YYYY-MM-DD
            
            game = request.data['game']
            owner = request.data['owner']
            public_or_private = request.data['public']
            status = request.data['status']
            winner = request.data['winner']
            player = request.data['player']
            amount = request.data['amount']
            user_public_key = request.data['user_public_key']

            order_by = request.data['order_by'] 
            order = request.data['order'] #asc, desc

            filters = Q()

            #created_at 
            if date_since and date_until:
                filters &= Q(created_at__range=(date_since, date_until))
            else:
                if date_since:
                    filters &= Q(created_at__gte=date_since)
                if date_until:
                    filters &= Q(created_at__lte=date_until)
            
            if owner:
                filters &= Q(created_by__public_key=owner)

            if winner:
                filters &= Q(winner__public_key=winner)
            
            if player:
                filters &= Q(players__public_key=player)

            if status is not None:
                filters &= Q(status=status)

            if amount:
                filters &= Q(tickets=amount)
            
            if game:
                filters &= Q(game=game)

            if public_or_private:
                if public_or_private == 1:
                    filters &= Q(public=True)
                elif public_or_private == 2:
                    private_filters = Q(
                        Q(created_by__public_key=user_public_key)
                        | Q(players__public_key=user_public_key)
                        | Q(winner__public_key=user_public_key)
                    )
                    filters &= (Q(public=False) & private_filters)
            else:
                private_filters = Q(
                Q(created_by__public_key=user_public_key)
                | Q(players__public_key=user_public_key)
                | Q(winner__public_key=user_public_key)
                )
                filters &= (
                    Q(public=True) | private_filters
                )

            rooms = Room.objects.filter(filters).distinct()

            order_char = '-' if order == 'desc' else ''
            if order_by == 'created_by':
                order_by = [order_char + 'created_by', order_char + 'created_at'] 
            if order_by == 'created_at':
                order_by = [order_char + 'created_at'] 
            if order_by == 'status':
                order_by =[order_char + 'status', order_char + 'created_at']
            if order_by == 'public':
                order_by =[order_char + 'public', order_char + 'created_at']
            if order_by == 'winner':
                order_by =[order_char + 'winner', order_char + 'created_at']
            if order_by == 'tickets':
                order_by = [order_char + 'tickets', order_char + 'created_at'] 
            if order_by == 'id':
                order_by = [order_char + 'id', order_char + 'created_at'] 
            if order_by == 'game':
                order_by = [order_char + 'game', order_char + 'created_at'] 

            rooms = rooms.order_by(*order_by)
            
            return rooms
    else:
        return None

@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def search_rooms(request):
    try:
        if ('start' in request.data and 'end' in request.data): 
            start = request.data['start']
            end = request.data['end']
            rooms = filter_rooms(request)
            if rooms is not None:
                
                total_rows = rooms.count()

                rooms = rooms[start:end]

                rooms_serialized = serializers.RoomSerializer(rooms, many=True).data

                return JsonResponse({ 'result': rooms_serialized, 'total_rows': total_rows }, status = status.HTTP_200_OK)
            else:
                return JsonResponse({ 'error': 'The values given to filter the elements were not correct' }, status = status.HTTP_400_BAD_REQUEST)
        else:
            return JsonResponse({ 'error': 'The values given to filter the elements were not correct' }, status = status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        manage_exception(request, e)
        return JsonResponse({'error': str(e)}, status = status.HTTP_400_BAD_REQUEST)
    
def filter_personal_rooms(request):
    if ( 'order_by' in request.data
            and 'public_key' in request.data
            and 'order' in request.data
        ):
            public_key = request.data['public_key']

            order_by = request.data['order_by'] 
            order = request.data['order'] #asc, desc

            rooms = Room.objects.filter(
                Q(created_by__public_key=public_key) |
                Q(players__public_key=public_key) |
                Q(winner__public_key=public_key)
            ).distinct()

            order_char = '-' if order == 'desc' else ''
            if order_by == 'created_by':
                order_by = [order_char + 'created_by', order_char + 'created_at'] 
            if order_by == 'created_at':
                order_by = [order_char + 'created_at'] 
            if order_by == 'status':
                order_by =[order_char + 'status', order_char + 'created_at']
            if order_by == 'public':
                order_by =[order_char + 'public', order_char + 'created_at']
            if order_by == 'winner':
                order_by =[order_char + 'winner', order_char + 'created_at']
            if order_by == 'tickets':
                order_by = [order_char + 'tickets', order_char + 'created_at'] 
            if order_by == 'id':
                order_by = [order_char + 'id', order_char + 'created_at'] 
            if order_by == 'game':
                order_by = [order_char + 'game', order_char + 'created_at'] 

            rooms = rooms.order_by(*order_by)
            
            return rooms
    else:
        return None
    
@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def search_personal_rooms(request):
    try:
        if ('start' in request.data and 'end' in request.data): 
            start = request.data['start']
            end = request.data['end']
            rooms = filter_personal_rooms(request)
            if rooms is not None:
                
                total_rows = rooms.count() 

                rooms = rooms[start:end]

                rooms_serialized = serializers.RoomSerializer(rooms, many=True).data

                return JsonResponse({ 'result': rooms_serialized, 'total_rows': total_rows }, status = status.HTTP_200_OK)
            else:
                return JsonResponse({ 'error': 'The values given to filter the elements were not correct' }, status = status.HTTP_400_BAD_REQUEST)
        else:
            return JsonResponse({ 'error': 'The values given to filter the elements were not correct' }, status = status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        manage_exception(request, e)
        return JsonResponse({'error': str(e)}, status = status.HTTP_400_BAD_REQUEST)
    
@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def view_room(request, id):
    try:
        if ('public_key' in request.data and id): 

            public_key = request.data['public_key']

            room = Room.objects.filter(
                # Q(created_by__public_key=public_key) |
                # Q(players__public_key=public_key) |
                # Q(winner__public_key=public_key) &
                Q(id=id)
            ).first()
            
            if room is not None:
                
                room_serialized = serializers.RoomSerializer(room).data

                return JsonResponse({ 'result': room_serialized }, status = status.HTTP_200_OK)
            else:
                return JsonResponse({ 'error': 'The values given were not correct' }, status = status.HTTP_400_BAD_REQUEST)
        else:
            return JsonResponse({ 'error': 'The values given were not correct' }, status = status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        manage_exception(request, e)
        return JsonResponse({'error': str(e)}, status = status.HTTP_400_BAD_REQUEST)