from django.contrib import admin
from django.urls import path
from django.urls import include
from jobs import views

urlpatterns = [
    path('', views.home),
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
]
