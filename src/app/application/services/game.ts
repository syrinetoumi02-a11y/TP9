import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Game } from '../models/game';
import { Observable } from 'rxjs';

const URL = 'http://localhost:3000/games';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private readonly _http = inject(HttpClient);

  private readonly _games = signal<Game[]>([]);
  games = this._games.asReadonly();

  getGames(): Observable<Game[]> {
    return this._http.get<Game[]>(URL);
  }

  addGame(game: Omit<Game, 'id'>): Observable<Game> {
    return this._http.post<Game>(URL, game);
  }

  setGames(games: Game[]): void {
    this._games.set(games);
  }

  addToGames(game: Game): void {
    this._games.update((games) => [...games, game]);
  }
}
