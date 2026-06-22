from .models import Notification
from notifications.utils import safe_group_send
import logging
from .serializers import NotificationSerializer

logger = logging.getLogger(__name__)

def notify(user, title, message, notif_type, action, reference_id=None):

    print("===== NOTIFY CALLED =====")
    print("USER:", user.username)

    # 1. Save notification in DB
    notification = Notification.objects.create(
        user=user,
        title=title,
        message=message,
        notification_type=notif_type,
        action=action,
        reference_id=reference_id,
    )

    # 2. Build payload
    payload = {
    "type": "send_notification",
    "data": NotificationSerializer(notification).data
}

    # 3. Send to user group
    user_group = f"user_{user.id}"
    print("Sending to user group:", user_group)
    safe_group_send(user_group, payload)

    # 4. Send to admin group
    print("Sending to admins group")
    safe_group_send("admins", payload)

    return notification