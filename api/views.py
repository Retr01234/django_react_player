from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import GroupSerializer, AddGroupSerializer
from .models import Group

# Create your views here.
class GroupView(generics.ListAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    
class AddGroupView(APIView):
    serializer_class = AddGroupSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            pausible = serializer.data.get('pausible')
            wants_to_skip = serializer.data.get('wants_to_skip')
            owner = self.request.session.session_key
            queryset = Group.objects.filter(owner=owner)
            
            if queryset.exists():
                group = queryset[0]
                group.pausible = pausible
                group.wants_to_skip = wants_to_skip
                group.save(update_fields=['pausible', 'wants_to_skip'])

                return Response(GroupSerializer(group).data, status=status.HTTP_200_OK)
            else:
                group = Group(owner=owner, pausible=pausible, wants_to_skip=wants_to_skip)
                group.save()

                return Response(GroupSerializer(group).data, status=status.HTTP_201_CREATED)
        
        return Response({'Bad Request': 'Data is Invalid'}, status=status.HTTP_400_BAD_REQUEST)