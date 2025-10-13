import {Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {GuestPageComponent} from './components/guest/guest-page/guest-page.component';
import {StatisticsPage} from './components/admin/page/statistics-page/statistics-page';
import {UserPage} from './components/admin/page/user-page/user-page';
import {ReservationPage} from './components/admin/page/reservation-page/reservation-page';
import {AdminPageComponent} from './components/admin/page/main-page/admin-page.component';
import {CalendarPage} from './components/admin/page/calendar-page/calendar-page';

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
      component: CalendarPage
    },
      {
        path: 'statistics',
        component: StatisticsPage
      },
      {
        path: 'reservations',
        component: ReservationPage
      },
      {
        path: 'users',
        component: UserPage
      },
    ]
  },
  {
    path: 'guest-page',
    component: GuestPageComponent
  }


]
