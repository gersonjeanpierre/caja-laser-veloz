import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Layout } from '@features/layout/layout';
import { Cashier } from '@features/cashier/cashier';
import { Sales } from '@features/sales/sales';
import { Dashboard } from '@features/dashboard/dashboard';

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
        path: 'dashboard',
        component: Dashboard
      },
      {
        path: 'ventas',
        component: Sales
      },
      {
        path: 'cortes-de-caja',
        component: Cashier
      },
    ]
  }
];
