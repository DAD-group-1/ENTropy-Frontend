import { Routes } from '@angular/router';
import { authGuard } from './guards/auth/auth-guard';
import { HomePage } from './page-modules/home/home-page';
import { LoginPage } from './page-modules/login/login-page';
import { CalendarPage } from './page-modules/calendar/calendar-page';
import { GradesPage } from './page-modules/grades/grades-page';
import { AbsencesPage } from './page-modules/absences/absences-page';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPage,
  },

  {
    path: '',
    // TODO: Activate authGuard when auth service is implemented
    // canMatch: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: HomePage,
      },
      {
        path: 'calendar',
        component: CalendarPage,
        // TODO: See how to implement permissions check
        // data: { roles: ['USER', 'ADMIN'] },
      },
      {
        path: 'grades',
        component: GradesPage,
        // TODO: See how to implement permissions check
        // data: { roles: ['USER', 'ADMIN'] },
      },
      {
        path: 'absences',
        component: AbsencesPage,
        // TODO: See how to implement permissions check
        // data: { roles: ['USER', 'ADMIN'] },
      },
    ],
  },
];
