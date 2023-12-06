from django.http import request
from django.conf import settings
from django.utils import timezone
from contextlib import redirect_stdout
import re, traceback, datetime, pytz
from django.db.models import Q

def remove_accents(text):
    text = re.sub('á','a', text)
    text = re.sub('é','e', text)
    text = re.sub('í','i', text)
    text = re.sub('ó','o', text)
    text = re.sub('ú','u', text)
    text = re.sub('à','a', text)
    text = re.sub('è','e', text)
    text = re.sub('ì','i', text)
    text = re.sub('ò','o', text)
    text = re.sub('ù','u', text)
    text = re.sub('ü','u', text)
    text = re.sub('Á','a', text)
    text = re.sub('É','e', text)
    text = re.sub('Í','i', text)
    text = re.sub('Ó','o', text)
    text = re.sub('Ú','u', text)
    text = re.sub('À','a', text)
    text = re.sub('È','e', text)
    text = re.sub('Ì','i', text)
    text = re.sub('Ò','o', text)
    text = re.sub('Ù','u', text)
    text = re.sub('Ü','u', text)
    return text

def error_log(message, showTraceback=False):
    print()
    print(f'ERROR:    {message}')
    if showTraceback:
        print(traceback.format_exc())

def manage_exception(request, ex=None):
    with open('error_logs.txt', 'a') as f:
        with redirect_stdout(f):
            print("\n**************** EXCEPTION ****************\n")
            print("Date: " + datetime.datetime.now(pytz.timezone('America/Argentina/Buenos_Aires')).isoformat())
            print("User: " + (request.user.public_key if request and request.user else "-") + "\n")
            print(traceback.format_exc())
            print("**************** END EXCEPTION ****************\n")

def user_has_group_in_action(user, module_actions_permission):
    for group in user.groups.all():
        if group.name in module_actions_permission:
            return True
    return False

def user_has_group_in_module(user, module_permission):
    permissions = find_module_field(settings.MODULES, module_permission, 'groups')
    
    for group in user.groups.all():
       if group.name in permissions:
           return True

    return False

def find_module_field(modules, name, field):
    try:
        split_name = name.split('_', 1) # Hace split por la primera ocurrencia
        module_to_search = split_name[0]
        result = next((item for item in modules if item["name"] == module_to_search), None) #Buscar en el diccionario por "name"
        
        if len(split_name) == 1:
            return result[field]
        
        return find_module_field(result['submodules'], split_name[1], field)

    except Exception as e:
        manage_exception(None, e)
        return []