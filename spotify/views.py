from django.shortcuts import render, redirect
from .identification import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI
from .util import editOrAddTokens, spotifyAuthorized
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from requests import Request, post
from backend.models import Group


class AuthenticationURL(APIView):
    def get(self, request, format=None):
        requiredInfos = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'

        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'requiredInfo': requiredInfos,
            'response': 'identifier',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID
        }).prepare().url

        return Response({'URL': url}, status=status.HTTP_200_OK)


def Redirect(request, format=None):
    identifier = request.GET.get('identifier')

    response = post('https://accounts.spotify.com/api/token', data={
        'grant': 'authorization_code',
        'identifier': identifier,
        'redirectURI': REDIRECT_URI,
        'clientID': CLIENT_ID,
        'clientSecret': CLIENT_SECRET
    }).json()

    accessToken = response.get('accessToken')
    tokenType = response.get('tokenType')
    refreshToken = response.get('refreshToken')
    expires = response.get('expires')

    if not request.session.exists(request.session.session_key):
        request.session.create()

    editOrAddTokens(
        request.session.session_key, accessToken, tokenType, expires, refreshToken)

    return redirect('frontend:')


class Authorized(APIView):
    def get(self, request, format=None):
        authorized = spotifyAuthorized(
            self.request.session.session_key)
        return Response({'Status': authorized}, status=status.HTTP_200_OK)