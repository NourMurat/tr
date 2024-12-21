from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_tournament, name='create_tournament'),
    path('<int:tournament_id>/add_players/', views.add_players, name='add_players'),
    path('<int:tournament_id>/', views.view_tournament, name='view_tournament'),
]
