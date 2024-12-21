from django import forms
from .models import Tournament, Player

class TournamentForm(forms.ModelForm):
    class Meta:
        model = Tournament
        fields = ['name', 'participants']

class PlayerForm(forms.ModelForm):
    class Meta:
        model = Player
        fields = ['nickname']