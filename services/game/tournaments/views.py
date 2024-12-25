#Create tournament

from django.shortcuts import render, redirect
from .models import Tournament

def create_tournament(request):
    if request.method == 'POST':
        participants_count = int(request.POST['participants_count'])
        if 3 <= participants_count <= 8:
            tournament = Tournament.objects.create(participants_count=participants_count)
            return redirect('tournaments:add_players', tournament_id=tournament.id)
        else:
            return render(request, 'tournaments/create_tournament.html', {'error': 'Please enter a number between 3 and 8.'})
    return render(request, 'tournaments/create_tournament.html')


#Add players
from itertools import combinations
from .models import Match, Player

def add_players(request, tournament_id):
    tournament = get_object_or_404(Tournament, id=tournament_id)
    if request.method == 'POST':
        nicknames = []
        for i in range(tournament.participants_count):
            nickname = request.POST[f'nickname_{i}']
            if nickname in nicknames or Player.objects.filter(nickname=nickname).exists():
                return render(request, 'tournaments/add_players.html', {
                    'tournament': tournament,
                    'range': range(tournament.participants_count),
                    'error': f"The nickname '{nickname}' is already taken or repeated. Please use unique nicknames."
                })
            nicknames.append(nickname)

        # Создаем игроков
        players = []
        for nickname in nicknames:
            player = Player.objects.create(tournament=tournament, nickname=nickname)
            players.append(player)

        # Генерируем пары матчей (круговая система)
        for player1, player2 in combinations(players, 2):
            Match.objects.create(tournament=tournament, player1=player1, player2=player2)

        return redirect('tournaments:view_tournament', tournament_id=tournament.id)
    return render(request, 'tournaments/add_players.html', {
        'tournament': tournament,
        'range': range(tournament.participants_count)
    })



# View tournament
from django.shortcuts import render, get_object_or_404
from .models import Tournament, Player, Match

def view_tournament(request, tournament_id):
    # Получаем данные турнира
    tournament = get_object_or_404(Tournament, id=tournament_id)
    players = tournament.players.all()

    # Получаем все матчи турнира
    matches = tournament.matches.all()

    # Формируем данные для отображения
    context = {
        'tournament': tournament,
        'players': players,
        'matches': matches,
    }
    return render(request, 'tournaments/view_tournament.html', context)

# start match
from django.shortcuts import get_object_or_404, redirect
from .models import Match

def start_match(request, match_id):
    match = get_object_or_404(Match, id=match_id)
    if request.method == 'POST':
        # Отметить матч как завершенный и установить результаты
        match.is_complete = True
        match.score_player1 = 3  # Пример результата
        match.score_player2 = 2
        match.winner = match.player1  # Установить победителя
        match.save()
    return redirect('tournaments:view_tournament', tournament_id=match.tournament.id)

