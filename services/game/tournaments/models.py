from django.db import models

class Tournament(models.Model):
    name = models.CharField(max_length=100)
    participants = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Player(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='players')
    nickname = models.CharField(max_length=50)

    def __str__(self):
        return self.nickname

class Match(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='matches')
    player1 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='matches_as_player1')
    player2 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='matches_as_player2')
    winner = models.ForeignKey(Player, on_delete=models.SET_NULL, null=True, blank=True, related_name='won_matches')
    completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.player1.nickname} vs {self.player2.nickname}"
