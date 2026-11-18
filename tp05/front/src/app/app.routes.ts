import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { guestGuard } from './guest.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'pollutions' },

  {
    path: 'pollutions',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pollution-list/pollution-list.component').then(
        (m) => m.PollutionListComponent
      ),
  },
  {
    path: 'pollutions/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pollution-detail/pollution-detail.component').then(
        (m) => m.PollutionDetailComponent
      ),
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./user-list/user-list.component').then(
        (m) => m.UserListComponent
      ),
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },

  { path: '**', redirectTo: 'pollutions' },
];
