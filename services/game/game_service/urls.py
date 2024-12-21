from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('pong', include('pong.urls')), # Подключение маршрутов приложения pong
    path('tournaments/', include('tournaments.urls')), # Подключение маршрутов приложения tournaments
]
