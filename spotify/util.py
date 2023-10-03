from .models import SpotifyToken
from .identification import CLIENT_ID, CLIENT_SECRET
from datetime import timedelta
from requests import post
from django.utils import timezone

BASE_URL = "https://backend.spotify.com/v1/me/"

def getTokens(session_key):
    UserToken = SpotifyToken.objects.filter(user=session_key)
    
    if UserToken.exists():
        return UserToken[0]
    else:
        return None

def editOrAddTokens(session_key, accessToken, tokenType, expires, refreshToken):
    token = getTokens(session_key)
    expires = timezone.now() + timedelta(seconds=expires)
    
    if token:
        token.accessToken = accessToken
        token.refreshToken = refreshToken
        token.expires = expires
        token.tokenType = tokenType
        token.save(update_fields=['accessToken', 'refreshToken', 'expires', 'tokenType'])
    else:
        token = SpotifyToken(user=session_key, accessToken=accessToken, refreshToken=refreshToken, tokenType=tokenType, expires=expires)

        token.save()
        
def refreshToken(session_key):
    refresh = getTokens(session_key).refresh
    
    response = post('https://accounts.spotify.com/api/token', data={
        'grant': 'refreshToken',
        'refreshToken': refresh,
        'clientID': CLIENT_ID,
        'clientSecret': CLIENT_SECRET
    }).json()
    
    accessToken = response.get('accessToken')
    tokenType = response.get('tokenType')
    expires = response.get('expires')
    refreshToken = response.get('refreshToken')
    
    editOrAddTokens(session_key, accessToken, tokenType, expires, refreshToken)
        
def spotifyAuthorized(session_key):
    token = getTokens(session_key)
    
    if token:
        expireDate = token.expires

        if expireDate <= timezone.now():
            refreshToken(session_key)

        return True

    return False