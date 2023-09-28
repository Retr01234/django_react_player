from rest_framework import serializers
from .models import Group

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('id', 'identifier', 'owner', 'pausible', 'wants_to_skip', 'created')
        
class AddGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('pausible', 'wants_to_skip')
        
class EditGroupSerializer(serializers.ModelSerializer):
    identifier = serializers.CharField(validators=[])

    class Meta:
        model = Group
        fields = ('pausible', 'wants_to_skip', 'identifier')