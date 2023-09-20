from django.db import models

# Create your models here.
class Group(models.Model):
    identifier = models.CharField(max_length=5, default="", unique=True)
    owner = models.CharField(max_length=75, unique=True)
    pausible = models.BooleanField(default= False, null=False)
    skippable = models.IntegerField(null=False, default=1)
    created = models.DateTimeField(auto_now_add=True)