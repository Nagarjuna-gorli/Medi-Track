from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


class AdminProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        if request.user.role != "admin":
            return Response(
                {"error": "Only admin allowed"},
                status=403
            )

        return Response({
            "id": request.user.id,
            "username": request.user.username,
            "first_name": request.user.first_name,
            "last_name": request.user.last_name,
            "email": request.user.email,
            "phone": request.user.phone,
            "role": request.user.role,
        })

    def patch(self, request):

        if request.user.role != "admin":
            return Response(
                {"error": "Only admin allowed"},
                status=403
            )

        user = request.user

        user.first_name = request.data.get(
            "first_name",
            user.first_name
        )

        user.last_name = request.data.get(
            "last_name",
            user.last_name
        )

        user.email = request.data.get(
            "email",
            user.email
        )

        user.phone = request.data.get(
            "phone",
            user.phone
        )
        
        user.save()

        return Response({
            "message": "Profile updated"
        })