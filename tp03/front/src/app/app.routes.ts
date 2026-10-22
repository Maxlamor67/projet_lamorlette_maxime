import { Routes } from '@angular/router';
import { PollutionListComponent } from './pollution-list/pollution-list.component';
import { PollutionDetailComponent } from './pollution-detail/pollution-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'pollutions', pathMatch: 'full' },
  { path: 'pollutions', component: PollutionListComponent },
  { path: 'pollutions/:id', component: PollutionDetailComponent }
];
