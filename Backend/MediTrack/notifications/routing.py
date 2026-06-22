from django.urls import path
from .consumers import NotificationConsumer

print("===== ROUTING LOADED =====")
websocket_urlpatterns = [
    path("ws/notifications/", NotificationConsumer.as_asgi()),
]