import { Routes } from '@angular/router';
import { HomePage } from './page-modules/home/home-page';
import { LoginPage } from './page-modules/login/login-page';

export const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
  },
  {
    path: 'login',
    component: LoginPage,
  },
];
