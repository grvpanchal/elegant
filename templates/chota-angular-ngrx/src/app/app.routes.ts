import { Routes } from '@angular/router';
import HomePageComponent from '../pages/HomePage.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: '**', redirectTo: '' },
];
