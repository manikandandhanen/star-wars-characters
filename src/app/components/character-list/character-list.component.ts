import { Component, OnInit } from '@angular/core';
import { CharacterService } from '../../services/character.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CharacterFilterComponent } from '../character-filter/character-filter.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-character-list',
  standalone: true,
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.scss',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    CharacterFilterComponent,
  ],
})
export class CharacterListComponent implements OnInit {
  characters: any[] = [];
  filteredCharacters: any[] = [];

  constructor(
    private character_Service: CharacterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.character_Service.getCharacters().subscribe((data) => {
      this.characters = data.results;
      this.filteredCharacters = this.characters;
    });
  }

  onCharacterClick(character: any): void {
    const id = character.url.split('/').slice(-2, -1)[0];
    this.router.navigate(['/characters', id]);
  }

  onFilterChange(filteredCharacters: any[]): void {
    this.filteredCharacters = filteredCharacters;
  }
}
