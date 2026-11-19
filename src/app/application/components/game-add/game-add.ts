import { Component, inject, signal, OnInit } from '@angular/core';
import { JsonPipe } from '@angular/common';

import { form, FormField, FormRoot, pattern, required, min } from '@angular/forms/signals';

import { Game } from '../../models/game';
import { Category } from '../../models/category';
import { GameService } from '../../services/game';

@Component({
  selector: 'app-game-add',
  imports: [FormField, FormRoot, JsonPipe],
  templateUrl: './game-add.html',
  styleUrl: './game-add.css',
})
export class GameAdd implements OnInit {
  categories = Object.values(Category);

  readonly gameService = inject(GameService);

  games = this.gameService.games;

  gameModel = signal<Game>({
    id: '',
    name: '',
    price: 0,
    madeIn: 'Tunisie',
    category: Category.Puzzle,
    isNew: true,
    shops: [],
  });

  // Formulaire avec validations
  gameForm = form(this.gameModel, (path) => {
    required(path.name, {
      message: 'Nom obligatoire',
    });

    pattern(path.name, /^[A-Z].+$/, {
      message: 'Le nom doit commencer par une majuscule',
    });

    required(path.price, {
      message: 'Prix obligatoire',
    });

    min(path.price, 0.1, {
      message: 'Le prix ne peut pas être inférieur à 0.1 DT',
    });
  });

  ngOnInit(): void {
    this.gameService.getGames().subscribe({
      next: (data) => this.gameService.setGames(data),
      error: (err) => console.error(err),
    });
  }

  onSubmit(): void {
    const { id, ...newGame } = this.gameModel();

    this.gameService.addGame(newGame).subscribe({
      next: (game) => {
        this.gameService.addToGames(game);

        console.log('Jeu ajouté :', game);

        this.resetForm();
      },
      error: (err) => console.error(err),
    });
  }

  resetForm(): void {
    this.gameModel.set({
      id: '',
      name: '',
      price: 0,
      madeIn: 'Tunisie',
      category: Category.Puzzle,
      isNew: true,
      shops: [],
    });

    this.gameForm().reset();
  }
}
