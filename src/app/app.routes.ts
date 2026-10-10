import {Routes} from '@angular/router';
import {LoginComponent} from '@features/auth/login.component';
import {RegisterComponent} from '@features/auth/register.component';
import {StatisticsPage} from '@features/statistics/statistics-page/statistics-page';
import {GuestPage} from '@features/guests/guest-page/guest-page.component';
import {ReservationTable} from '@features/reservations/table/reservation-table.component';
import {AdminPageComponent} from '@features/main-page/admin-page.component';
import {CalendarPage} from '@features/reservations/calendar/calendar-page';
import {SettingsPage} from '@features/settings/settings-page/settings-page.component';
import {Dashboard} from '@features/dashboard/dashboard';

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
    children:[
      {
        path: 'dashboard',
        component: Dashboard
      },
      {
      path: 'calendar',
      component: CalendarPage
      },
      {
        path: 'statistics',
        component: StatisticsPage
      },
      {
        path: 'reservations',
        component: ReservationTable
      },
      {
        path: 'users',
        component: GuestPage
      },
      {
        path: 'settings',
        component: SettingsPage
      },
    ]
  },
]
