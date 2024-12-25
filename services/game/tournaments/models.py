from django.db import models

class Tournament(models.Model):
    name = models.CharField(max_length=100, default="Tournament")
    participants_count = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    # def __str__(self):
    #     return self.name

class Player(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name="players")
    nickname = models.CharField(max_length=50, unique=True)

    # def __str__(self):
    #     return self.nickname

class Match(models.Model):
    tournament = models.ForeignKey('Tournament', on_delete=models.CASCADE, related_name='matches')
    player1 = models.ForeignKey('Player', on_delete=models.CASCADE, related_name='player1_matches')
    player2 = models.ForeignKey('Player', on_delete=models.CASCADE, related_name='player2_matches')
    score_player1 = models.PositiveIntegerField(null=True, blank=True)
    score_player2 = models.PositiveIntegerField(null=True, blank=True)
    winner = models.ForeignKey('Player', null=True, blank=True, on_delete=models.SET_NULL, related_name='won_matches')
    is_complete = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.player1.nickname} vs {self.player2.nickname}"


    # def __str__(self):
    #     return f"{self.player1.nickname} vs {self.player2.nickname}"
