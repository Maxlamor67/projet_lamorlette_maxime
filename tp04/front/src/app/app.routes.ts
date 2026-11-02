import { Routes } from '@angular/router';
import { PollutionListComponent } from './pollution-list/pollution-list.component';
import { PollutionDetailComponent } from './pollution-detail/pollution-detail.component';
import { UserListComponent } from './user-list/user-list.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'pollutions', pathMatch: 'full' },
  { path: 'pollutions', component: PollutionListComponent, canActivate: [authGuard] },
  { path: 'pollutions/:id', component: PollutionDetailComponent, canActivate: [authGuard] },
  { path: 'users', component: UserListComponent },
  { path: 'login', component: LoginComponent }
];
