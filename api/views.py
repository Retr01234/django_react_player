from django.shortcuts import render
from rest_framework import generics
from .serializers import GroupSerializer
from .models import Group

# Create your views here.
class GroupView(generics.ListAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer