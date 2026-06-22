from urllib.parse import parse_qs

class JWTAuthMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):

        # IMPORT INSIDE (IMPORTANT FIX)
        from django.contrib.auth.models import AnonymousUser
        from rest_framework_simplejwt.authentication import JWTAuthentication
        from asgiref.sync import sync_to_async

        jwt_auth = JWTAuthentication()

        query_string = scope["query_string"].decode()
        token = parse_qs(query_string).get("token")

        scope["user"] = AnonymousUser()

        if token:
            try:
                validated = await sync_to_async(jwt_auth.get_validated_token)(token[0])
                user = await sync_to_async(jwt_auth.get_user)(validated)
                scope["user"] = user
            except Exception as e:
                print("JWT ERROR:", e)

        return await self.app(scope, receive, send)