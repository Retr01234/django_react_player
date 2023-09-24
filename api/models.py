from django.db import models
import string
import random

def create_random_identifier():
    length = 4
    
    while True:
        identifier = ''.join(random.choices(string.ascii_lowercase, k=length))
        
        if Group.objects.filter(identifier=identifier).count() == 0:
            break
    
    return identifier

# Create your models here.
class Group(models.Model):
    identifier = models.CharField(max_length=5, default=create_random_identifier, unique=True)
    owner = models.CharField(max_length=15, unique=True)
    pausible = models.BooleanField(default= False, null=False)
    wants_to_skip = models.IntegerField(null=False, default=1)
    created = models.DateTimeField(auto_now_add=True)