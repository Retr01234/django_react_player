from django.urls import path
from .views import GroupView, AddGroupView

urlpatterns = [
    path('group', GroupView.as_view()),
    path('add-group', AddGroupView.as_view())
]
