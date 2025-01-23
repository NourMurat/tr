# ft_transcendence/services/game/pong/views.py

from django.shortcuts import render
from tournaments.models import Match 

# Create your views here.
def game_view(request):
    # Get match details
    
    # Render inside game.html
    return render(request, 'pong/game.html', {'match_details': match_details})