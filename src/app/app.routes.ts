import {Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {AdminPageComponent} from './components/admin/admin-main-page/admin-page.component';
import {GuestPageComponent} from './components/guest/guest-page/guest-page.component';
import {StatisticsComponent} from './components/admin/statistics/statistics.component';
import {ReservationsComponent} from './components/admin/reservations/reservations.component';
import {UsersComponent} from './components/admin/users/users.component';
import {OptionsComponent} from './components/admin/options/options.component';
import {NewCalendarComponent} from './components/admin/new/new-calendar/new-calendar.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },

  {
    path: 'admin-page',
    component: AdminPageComponent,
    children:[{
      path: 'calendar',
      component: NewCalendarComponent
    },
      {
        path: 'statistics',
        component: StatisticsComponent
      },
      {
        path: 'reservations',
        component: ReservationsComponent
      },
      {
        path: 'users',
        component: UsersComponent
      }, {
        path: 'options',
        component: OptionsComponent
      },
    ]
  },
  {
    path: 'guest-page',
    component: GuestPageComponent
  }


]
