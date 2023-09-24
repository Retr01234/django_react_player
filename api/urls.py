from django.urls import path
from .views import GroupView, AddGroupView, GetGroupView

urlpatterns = [
    path('group', GroupView.as_view()),
    path('add-group', AddGroupView.as_view()),
    path('get-group', GetGroupView.as_view())
]
