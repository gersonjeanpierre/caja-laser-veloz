import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Layout } from '@features/layout/layout';
import { Cashier } from '@features/cashier/cashier';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'cashier',
        component: Cashier
      }
    ]
  }
];
