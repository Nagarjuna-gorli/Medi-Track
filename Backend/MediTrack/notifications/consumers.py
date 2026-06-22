import json
from channels.generic.websocket import AsyncWebsocketConsumer


class NotificationConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        print("===== CONSUMER LOADED =====")

        user = self.scope["user"]

        if user.is_anonymous:
            print("NO AUTH USER")
            await self.close()
            return

        if getattr(user, "role", "") == "admin":
            self.group_name = "admins"
        else:
            self.group_name = f"user_{user.id}"

        print("GROUP:", self.group_name)

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        print("CONNECTED USER:", user.username)

        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )

        print("WS DISCONNECTED:", close_code)

    async def send_notification(self, event):
        print("SEND_NOTIFICATION FIRED")
        await self.send(text_data=json.dumps(event["data"]))