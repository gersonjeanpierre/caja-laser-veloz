import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Panel } from 'primeng/panel';
import { LogoLaserVeloz } from "@shared/components/logo-laser-veloz/logo-laser-veloz";
import { MenuItem } from 'primeng/api';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.html',
  styleUrl: './layout.css',
  imports: [
    Panel,
    LogoLaserVeloz,
    CommonModule,
    RouterModule,
    RouterOutlet
  ],
})
export class Layout {

  router = inject(Router)
  private cdr = inject(ChangeDetectorRef);
  cashierFullName: string = '';
  cashier: [] = [];
  items: MenuItem[] = [];
  emSize = 'em-size';


  ngOnInit() {
    this.getLocalStorageCashier();
    this.cdr.detectChanges();
    this.items = [
      { label: 'Dashboard', icon: 'pi-fw pi-home', routerLink: '/dashboard' },
      { label: 'Ventas', icon: 'pi-shopping-cart', routerLink: '/ventas' },
      { label: 'Cortes de Caja', icon: 'pi-money-bill', routerLink: '/cortes-de-caja' },
      { label: 'Clientes', icon: 'pi-fw pi-users', routerLink: '/clientes' },
      { label: 'Diseñadores', icon: 'pi-fw pi-pencil', routerLink: '/diseñadores' },
      { label: 'Cerrar Sesión', icon: 'pi-fw pi-sign-out', routerLink: '/login' },
    ]
  }

  getLocalStorageCashier() {
    const cashierStr = localStorage.getItem('selectedCashier');
    const cashier = cashierStr ? JSON.parse(cashierStr) : null;
    this.cashier = cashier;
    this.cashierFullName = cashier ? cashier.fullName : '';
  }
}
