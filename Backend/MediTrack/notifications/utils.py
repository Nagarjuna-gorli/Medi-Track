from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import logging

logger = logging.getLogger(__name__)

def safe_group_send(group, payload):
    try:
        channel_layer = get_channel_layer()

        if not channel_layer:
            print("CHANNEL LAYER NOT FOUND")
            return

        async_to_sync(channel_layer.group_send)(
            group,
            payload
        )

    except Exception as e:
        logger.error(f"Redis group_send failed: {e}")
        print("REDIS ERROR:", e)