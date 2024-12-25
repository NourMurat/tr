# ft_transcendence/services/game/pong/views.py

from django.shortcuts import render

# Create your views here.
def game_view(request):
    return render(request, 'pong/game.html')