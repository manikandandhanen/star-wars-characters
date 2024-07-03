import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CharacterService } from '../../services/character.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-character-filter',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    FormsModule,
  ],
  templateUrl: './character-filter.component.html',
  styleUrl: './character-filter.component.scss',
})
export class CharacterFilterComponent implements OnInit {
  @Output() filterChange = new EventEmitter<any[]>();

  characters: any[] = [];
  filteredCharacters: any[] = [];
  filterCriteria: any = {
    movie: '',
    species: '',
    birthYearRange: { min: null, max: null },
  };

  constructor(private character_Service: CharacterService) {}

  ngOnInit(): void {
    this.character_Service.getCharacters().subscribe((data) => {
      this.characters = data.results;
      this.filteredCharacters = this.characters;
    });
  }

  applyFilter(): void {
    this.filteredCharacters = this.characters.filter((character) => {
      const matchesMovie =
        !this.filterCriteria.movie ||
        character.films.includes(this.filterCriteria.movie);
      const matchesSpecies =
        !this.filterCriteria.species ||
        character.species.includes(this.filterCriteria.species);
      const matchesBirthYear =
        (!this.filterCriteria.birthYearRange.min ||
          character.birth_year >= this.filterCriteria.birthYearRange.min) &&
        (!this.filterCriteria.birthYearRange.max ||
          character.birth_year <= this.filterCriteria.birthYearRange.max);
      return matchesMovie && matchesSpecies && matchesBirthYear;
    });
    this.filterChange.emit(this.filteredCharacters);
  }
}
