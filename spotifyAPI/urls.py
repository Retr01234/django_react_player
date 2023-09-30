from django.urls import path
from .views import AuthenticationURL, Redirect, Authorized

urlpatterns = [
    path('get-verified-url', AuthenticationURL.as_view()),
    path('redirect', Redirect),
    path('authorized', Authorized.as_view())
]