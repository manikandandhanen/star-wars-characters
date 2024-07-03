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
    return this.http.get(`${environment.LOGIN_URL}`);
  }

  getCharacter(id: number): Observable<any> {
    return this.http.get<any>(`${environment.LOGIN_URL}/${id}`);
  }
}
