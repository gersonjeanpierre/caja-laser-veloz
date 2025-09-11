import { Injectable } from '@angular/core';
import { Customer } from '@core/models/customer.model';
import { Designer } from '@core/models/designer.model';
import { Gallery, Stand, ICashier, CashierCut, Sale } from '@core/models/index';
import Dexie, { EntityTable } from 'dexie';
import { galleriesSeed } from './seeds/galleries.seed';
import { standsSeed } from './seeds/stands.seed';
import { designersSeed } from './seeds/designers.seed';

@Injectable({
  providedIn: 'root'
})
export class DexieService extends Dexie {
  galleries!: EntityTable<Gallery, 'id'>;
  stands!: EntityTable<Stand, 'id'>;
  cashier!: EntityTable<ICashier, 'id'>;
  sales!: EntityTable<Sale, 'id'>;
  cashierCuts!: EntityTable<CashierCut, 'id'>;
  designers!: EntityTable<Designer, 'id'>;
  customers!: EntityTable<Customer, 'id'>;

  constructor() {
    super('CajaLaserVelozDB');
    this.version(1).stores({
      galleries: 'id, name',
      stands: 'id, internalId, name, galleryId',
      sales: 'id, correlative, cashierId, designerId, customerId, status, paymentMethod',
      cashier: 'id, fullName',
      cashierCuts: 'id, cashierId, openingTime, closingTime, status',
      designers: 'id, name, isActive',
      customers: 'id, fullName, dni, ruc, phone, email, isActive',
    });

    this.on('ready', () => this.seedData());
  }

  private async seedData() {
    const galleryCount = await this.galleries.count();
    if (galleryCount === 0) {
      await this.galleries.bulkAdd(galleriesSeed);
      await this.stands.bulkAdd(standsSeed)
    }

    const designerCount = await this.designers.count();
    if (designerCount === 0) {
      await this.designers.bulkAdd(designersSeed);
    }
  }
}
