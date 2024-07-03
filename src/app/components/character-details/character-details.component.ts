import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CharacterService } from '../../services/character.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-character-details',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule, MatTabsModule],
  templateUrl: './character-details.component.html',
  styleUrl: './character-details.component.scss',
})
export class CharacterDetailsComponent implements OnInit {
  character: any;
  homeworldName: string = '';
  speciesName: string = '';
  films: string[] = [];
  vehicles: string[] = [];
  starships: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private characterService: CharacterService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.characterService.getCharacter(Number(id)).subscribe((data) => {
      this.character = data;
      this.character.id = id; // Ensure the character has an id property for the avatar image
      this.loadAdditionalData();
    });
  }

  loadAdditionalData() {
    // Fetch homeworld name
    if (this.character.homeworld) {
      this.characterService
        .getData(this.character.homeworld)
        .subscribe((homeworld) => {
          this.homeworldName = homeworld.name;
        });
    }

    // Fetch species name
    if (this.character.species && this.character.species.length > 0) {
      this.characterService
        .getData(this.character.species[0])
        .subscribe((species) => {
          this.speciesName = species.name;
        });
    }

    // Fetch film titles
    if (this.character.films && this.character.films.length > 0) {
      this.character.films.forEach((filmUrl: string) => {
        this.characterService.getData(filmUrl).subscribe((film) => {
          this.films.push(film.title);
        });
      });
    }

    // Fetch vehicle names
    if (this.character.vehicles && this.character.vehicles.length > 0) {
      this.character.vehicles.forEach((vehicleUrl: string) => {
        this.characterService.getData(vehicleUrl).subscribe((vehicle) => {
          this.vehicles.push(vehicle.name);
        });
      });
    }

    // Fetch starship names
    if (this.character.starships && this.character.starships.length > 0) {
      this.character.starships.forEach((starshipUrl: string) => {
        this.characterService.getData(starshipUrl).subscribe((starship) => {
          this.starships.push(starship.name);
        });
      });
    }
  }
}
