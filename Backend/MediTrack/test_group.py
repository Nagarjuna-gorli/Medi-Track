import os
import django
import asyncio

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "MediTrack.settings")
django.setup()

from channels.layers import get_channel_layer

async def test():
    layer = get_channel_layer()

    await layer.group_add(
        "admins",
        "test_channel"
    )

    print("GROUP ADD SUCCESS")

asyncio.run(test())