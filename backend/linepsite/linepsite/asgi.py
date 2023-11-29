"""
ASGI config for linepsite project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'linepsite.settings')

default_app = get_asgi_application()

from channels.routing import ProtocolTypeRouter
from channels.routing import URLRouter

from . import urls

application = ProtocolTypeRouter({
    "http": default_app,
})
