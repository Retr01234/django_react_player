from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('backend/', include('backend.urls')),
    path('spotify/', include('spotify.urls')),
    path('', include('frontend.urls'))
]
