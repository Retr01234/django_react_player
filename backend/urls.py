from django.urls import path
from .views import GroupView, AddGroupView, GetGroupView, EnterGroupView, PersonInGroup, ExitGroupView, EditGroupView

urlpatterns = [
    path('group', GroupView.as_view()),
    path('add-group', AddGroupView.as_view()),
    path('get-group', GetGroupView.as_view()),
    path('enter-group', EnterGroupView.as_view()),
    path('person-in-group', PersonInGroup.as_view()),
    path('exit-group', ExitGroupView.as_view()),
    path('edit-group', EditGroupView.as_view())
]
