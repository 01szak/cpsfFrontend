import {Routes} from '@angular/router';
import {AdminMainPageComponent} from './components/admin/admin-main-page/admin-main-page.component';
import {ReservationsComponent} from './components/admin/reservations/reservations.component';
import {StatisticsComponent} from './components/admin/statistics/statistics.component';
import {UsersComponent} from './components/admin/users/users.component';
import {LoginComponent} from './components/login/login.component';
import {AuthorizedContentComponent} from './components/authorized-content/authorized-content.component';

export const routes: Routes = [
  {
    path: "",
    component: LoginComponent
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "**",
    redirectTo: "login"
  },

  {
    path: "authorized-content",
    component: AuthorizedContentComponent
  },
  {
    path: "register",
    component: ReservationsComponent
  },
  {
    path: "adminMainPage",
    component: AdminMainPageComponent
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
