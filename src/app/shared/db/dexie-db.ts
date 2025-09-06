
import { Gallery } from '@core/models/gallery.model';
import { Order } from '@core/models/order.model';
import { Stand } from '@core/models/stand.model';
import Dexie, { EntityTable } from 'dexie';

export class CotizaDB extends Dexie {
  galleries!: EntityTable<Gallery, 'id'>;
  stands!: EntityTable<Stand, 'id'>;
  cashier!: EntityTable<any, string>;
  orders!: EntityTable<Order, 'id'>

  constructor() {
    super('CajaLaserVelozDB');
    this.version(1).stores({
      galleries: 'id, name',
      stands: 'id, name, galleryId',
      orders: 'id, correlative, cashierId, designerId, customerId, status, paymentMethod',
      cashier: 'id, cashierId, openingTime, closingTime, status'
    });
  }
}


