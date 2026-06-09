import { Routes } from '@angular/router';
import { authCanMatchGuard, authCanActivateGuard } from './guards/auth/auth-guard';
import { roleGuard } from './guards/roles/role-guard';
import { HomePage } from './page-modules/home/home-page';
import { LoginPage } from './page-modules/login/login-page';
import { CalendarPage } from './page-modules/calendar/calendar-page';
import { GradesPage } from './page-modules/grades/grades-page';
import { AttendancesPage } from './page-modules/attendances/attendances-page';
import { ProfilePage } from './page-modules/profile/profile-page';
import { NotFoundPage } from './page-modules/not-found/not-found-page';
import { ForbiddenPage } from './page-modules/forbidden/forbidden-page';
import { NotificationsPage } from './page-modules/notifications/notifications-page';

import { Roles } from './shared-modules/service/front-auth.service';
import { ResourcesPage } from './page-modules/resources/resources-page';
import { PaymentsPage } from './page-modules/payments/payments-page';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPage,
  },

  {
    path: '',
    canMatch: [authCanMatchGuard],
    canActivateChild: [authCanActivateGuard, roleGuard],
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
      },
      {
        path: 'grades',
        children: [
          {
            path: '',
            component: GradesPage,
          },
          {
            path: ':id',
            component: GradesPage,
            data: { excluded_roles: [Roles.STUDENT] },
          },
        ],
      },
      {
        path: 'attendances',
        children: [
          {
            path: '',
            component: AttendancesPage,
          },
          {
            path: ':id',
            component: AttendancesPage,
            data: { excluded_roles: [Roles.STUDENT] },
          },
        ],
      },
      {
        path: 'profile',
        children: [
          {
            path: '',
            component: ProfilePage,
          },
          {
            path: ':id',
            component: ProfilePage,
            data: { excluded_roles: [Roles.STUDENT] },
          },
        ],
      },
      {
        path: 'payments',
        children: [
          {
            path: '',
            component: PaymentsPage,
          },
          {
            path: ':id',
            component: PaymentsPage,
            data: { excluded_roles: [Roles.STUDENT] },
          },
        ],
      },

      {
        path: 'notifications',
        component: NotificationsPage,
      },

      {
        path: 'resources',
        component: ResourcesPage,
      },
    ],
  },

  {
    path: 'forbidden',
    component: ForbiddenPage,
  },

  {
    path: '**',
    component: NotFoundPage,
  },
];
