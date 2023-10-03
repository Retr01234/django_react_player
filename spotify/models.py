from django.db import models

class SpotifyToken(models.Model):
    user = models.CharField(max_length=25, unique=True)
    created = models.DateTimeField(auto_now_add=True)
    refreshToken = models.CharField(max_length=150)
    accessToken = models.CharField(max_length=150)
    expires = models.DateTimeField()
    tokenType = models.CharField(max_length=50)