import os
import django
import asyncio

os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    "MediTrack.settings"
)

django.setup()

from channels.layers import get_channel_layer


async def test():
    layer = get_channel_layer()

    print("Layer:", layer)

    await layer.group_add(
        "test_group",
        "test_channel"
    )

    print("SUCCESS")


asyncio.run(test())