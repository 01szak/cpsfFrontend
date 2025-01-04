import {Routes} from '@angular/router';
import {CalendarComponent} from '../calendar/calendar.component';
import {AdminPageComponent} from '../admin-main-page/admin-page.component';
import * as path from 'path';

export const routes: Routes = [
  {
    path: 'admin-page',
    component: AdminPageComponent,
    children: [
      {
        path: 'calendar'
        , component: CalendarComponent
      }
    ]
  }

]
