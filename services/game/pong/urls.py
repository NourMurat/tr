# ft_transcendence/services/game/pong/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('', views.game_view, name='pong_game'),
]