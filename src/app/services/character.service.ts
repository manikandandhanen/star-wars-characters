import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  constructor(private http: HttpClient) {}

  getCharacters(): Observable<any> {
    return this.http.get(`${environment.API_URL}/people`);
  }

  getCharacter(id: number): Observable<any> {
    return this.http.get<any>(`${environment.API_URL}/people/${id}`);
  }

  getSpecies(): Observable<any> {
    return this.http.get(`${environment.API_URL}/species`);
  }

  getMovies(): Observable<any> {
    return this.http.get(`${environment.API_URL}/films`);
  }
}
