import { Component, OnInit, ViewChild } from '@angular/core';
import { CharacterService } from '../../services/character.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CharacterFilterComponent } from '../character-filter/character-filter.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatProgressSpinnerModule,
    CharacterFilterComponent,
    FormsModule,
  ],
})
export class CharacterListComponent implements OnInit {
  displayedColumns: string[] = [
    'sno',
    'avatar',
    'name',
    'species',
    'birth_year',
    'details',
  ];
  dataSource!: MatTableDataSource<any>;
  originalData: any[] = [];

  minBirthYear: string = '';
  maxBirthYear: string = '';
  matchingCharactersCount: number = 0;

  selectedMovies: string[] = [];
  selectedSpecies: string[] = [];
  selectedBirthYears: string[] = [];
  moviesList: string[] = [];
  speciesList: string[] = [];
  birthYears: any[] = [];
  filmMap: Map<string, string> = new Map();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private characterService: CharacterService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.characterService.getCharacters().subscribe((data) => {
      this.originalData = data.results;
      this.dataSource = new MatTableDataSource(data.results);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.mapSpeciesNames();
    });
    this.getSpeciesList();
    this.getMoviesList();
  }

  getSpeciesList(): void {
    this.characterService.getSpecies().subscribe((data) => {
      this.speciesList = data.results.map(
        (species: { name: any }) => species.name
      );
    });
  }

  getMoviesList(): void {
    this.characterService.getMovies().subscribe((data) => {
      this.moviesList = data.results.map((movie: any) => movie.title);
      data.results.forEach((movie: any) => {
        this.filmMap.set(movie.url, movie.title);
      });
    });
  }

  mapSpeciesNames() {
    const speciesRequests = this.originalData.map((character: any) => {
      if (character.species.length > 0) {
        return this.http.get(character.species[0]).toPromise();
      } else {
        return Promise.resolve({ name: 'Unknown' });
      }
    });

    Promise.all(speciesRequests)
      .then((speciesData: any[]) => {
        this.originalData.forEach((character: any, index: number) => {
          character.species = speciesData[index].name;
        });
        this.applyFilter();
      })
      .catch((error) => {
        console.error('Error fetching species data:', error);
      });
  }

  applyFilter() {
    const filteredData = this.originalData.filter((character: any) => {
      const movieNames = character.films.map((filmUrl: string) =>
        this.filmMap.get(filmUrl)
      );

      const movieFilter =
        this.selectedMovies.length === 0 ||
        this.selectedMovies.every((movie) => movieNames.includes(movie));

      const speciesFilter =
        this.selectedSpecies.length === 0 ||
        this.selectedSpecies.includes(character.species);

      const birthYearFilter = this.isWithinBirthYearRange(character.birth_year);

      return movieFilter && speciesFilter && birthYearFilter;
    });

    this.dataSource.data = filteredData;

    this.matchingCharactersCount = filteredData.length;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isWithinBirthYearRange(birthYear: string): boolean {
    if (!this.minBirthYear && !this.maxBirthYear) {
      return true;
    }

    const year = this.convertBirthYearToNumber(birthYear);
    const minYear = this.maxBirthYear
      ? this.convertBirthYearToNumber(this.maxBirthYear)
      : -Infinity;
    const maxYear = this.minBirthYear
      ? this.convertBirthYearToNumber(this.minBirthYear)
      : Infinity;

    return year >= minYear && year <= maxYear;
  }

  convertBirthYearToNumber(birthYear: string): number {
    birthYear = birthYear.toUpperCase();
    if (birthYear.includes('BBY')) {
      return -parseFloat(birthYear.replace('BBY', ''));
    } else if (birthYear.includes('ABY')) {
      return parseFloat(birthYear.replace('ABY', ''));
    } else {
      return 0;
    }
  }

  getAvatarUrl(character: any): string {
    const characterId = character.url.split('/').slice(-2, -1)[0];
    return `assets/character-avatar/${characterId}.jpg`;
  }

  onCharacterClick(character: any): void {
    const id = character.url.split('/').slice(-2, -1)[0];
    this.router.navigate(['/characters', id]);
  }
}
