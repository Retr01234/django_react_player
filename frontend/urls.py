from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('enter', index),
    path('add', index),
    path('enter/1', index)
]