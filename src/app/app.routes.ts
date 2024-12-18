import {Routes} from '@angular/router';
import {AdminMainPageComponent} from './components/admin/admin-main-page/admin-main-page.component';
import {ReservationsComponent} from './components/admin/reservations/reservations.component';
import {StatisticsComponent} from './components/admin/statistics/statistics.component';
import {UsersComponent} from './components/admin/users/users.component';

export const routes: Routes = [
  {
    path: "",
    component: AdminMainPageComponent
  },
  {
    path: "reservations",
    component: ReservationsComponent
  },
  {
    path: "reservations",
    component: ReservationsComponent
  },
  {
    path: "statistics",
    component: StatisticsComponent
  },
  {
    path: "users",
    component: UsersComponent
  }
];
