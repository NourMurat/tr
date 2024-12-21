from django.shortcuts import render, redirect, get_object_or_404
from .models import Tournament, Player, Match
from .forms import TournamentForm, PlayerForm

def create_tournament(request):
    if request.method == 'POST':
        form = TournamentForm(request.POST)
        if form.is_valid():
            tournament = form.save()
            return redirect('add_players', tournament_id=tournament.id)
    else:
        form = TournamentForm()
    return render(request, 'tournaments/create_tournament.html', {'form': form})

def add_players(request, tournament_id):
    tournament = get_object_or_404(Tournament, id=tournament_id)
    if request.method == 'POST':
        form = PlayerForm(request.POST)
        if form.is_valid():
            player = form.save(commit=False)
            player.tournament = tournament
            player.save()
            if tournament.players.count() == tournament.participants:
                return redirect('view_tournament', tournament_id=tournament.id)
    else:
        form = PlayerForm()
    return render(request, 'tournaments/add_players.html', {'form': form, 'tournament': tournament})

def view_tournament(request, tournament_id):
    tournament = get_object_or_404(Tournament, id=tournament_id)
    matches = Match.objects.filter(tournament=tournament)
    return render(request, 'tournaments/view_tournament.html', {
        'tournament': tournament,
        'matches': matches
    })
