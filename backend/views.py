from django.shortcuts import render
from django.http import JsonResponse
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import GroupSerializer, AddGroupSerializer
from .models import Group

# Create your views here.
class GroupView(generics.ListAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class PersonInGroup(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        data = {
            'identifier': self.request.session.get('group_identifier')
        }
        return JsonResponse(data, status=status.HTTP_200_OK)

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
                
                self.request.session['group_identifier'] = group.identifier

                return Response(GroupSerializer(group).data, status=status.HTTP_200_OK)
            else:
                group = Group(owner=owner, pausible=pausible, wants_to_skip=wants_to_skip)
                group.save()
                
                self.request.session['group_identifier'] = group.identifier

                return Response(GroupSerializer(group).data, status=status.HTTP_201_CREATED)
        
        return Response({'Bad Request': 'Data is Invalid'}, status=status.HTTP_400_BAD_REQUEST)
    
class GetGroupView(APIView):
    serializer_class = GroupSerializer
    search_url = 'identifier'
    
    def get(self, request, format=None):
        identifier = request.GET.get(self.search_url)

        if identifier != None:
            group = Group.objects.filter(identifier=identifier)

            if len(group) > 0:
                data = GroupSerializer(group[0]).data
                data['owner'] = self.request.session.session_key == group[0].owner

                return Response(data, status=status.HTTP_200_OK)
            return Response({'Group Not Found': 'Invalid identifier.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'Bad Request': 'Identifier Paramater not found'}, status=status.HTTP_400_BAD_REQUEST)

class EnterGroupView(APIView):
    search_url = 'identifier'
    
    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        identifier = request.data.get(self.search_url)

        if identifier != None:
            outcome = Group.objects.filter(identifier=identifier)

            if len(outcome) > 0:
                group = outcome[0]
                self.request.session['group_identifier'] = identifier

                return Response({'message': 'Group Entered!'}, status=status.HTTP_200_OK)

            return Response({'Bad Request': 'Invalid Group Identifier'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'Bad Request': 'Invalid Data, could not find Identifier'}, status=status.HTTP_400_BAD_REQUEST)

class ExitGroup(APIView):
    def post(self, request, format=None):
        if 'group_identifier' in self.request.session:
            self.request.session.pop('group_identifier')
            ownerID = self.request.session.session_key
            groupOutcome = Group.objects.filter(owner=ownerID)
            if len(groupOutcome) > 0:
                group = groupOutcome[0]
                group.delete()

        return Response({'Message': 'Success'}, status=status.HTTP_200_OK)