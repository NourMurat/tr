# Generated by Django 5.0.7 on 2024-12-23 11:54

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tournaments', '0002_match'),
    ]

    operations = [
        migrations.RenameField(
            model_name='match',
            old_name='completed',
            new_name='is_complete',
        ),
        migrations.RenameField(
            model_name='tournament',
            old_name='participants',
            new_name='participants_count',
        ),
        migrations.AlterField(
            model_name='match',
            name='player1',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='player1_matches', to='tournaments.player'),
        ),
        migrations.AlterField(
            model_name='match',
            name='player2',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='player2_matches', to='tournaments.player'),
        ),
        migrations.AlterField(
            model_name='player',
            name='nickname',
            field=models.CharField(max_length=50, unique=True),
        ),
        migrations.AlterField(
            model_name='tournament',
            name='name',
            field=models.CharField(default='Tournament', max_length=100),
        ),
    ]
