import { Routes } from '@angular/router';
import { CharacterDetailsComponent } from './components/character-details/character-details.component';
import { CharacterListComponent } from './components/character-list/character-list.component';
import { SidenavMenuComponent } from './components/sidenav-menu/sidenav-menu.component';

export const routes: Routes = [
  {
    path: '',
    component: SidenavMenuComponent,
    children: [
      { path: '', component: CharacterListComponent },
      { path: 'characters/:id', component: CharacterDetailsComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
