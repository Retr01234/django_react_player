from django.urls import path
from .views import index

app = 'frontend'

urlpatterns = [
    path('', index, name=''),
    path('enter', index),
    path('add', index),
    path('group/<str:groupIdentifier>', index)
]