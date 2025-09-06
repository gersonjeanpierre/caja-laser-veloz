import { Injectable } from '@angular/core';
import { Gallery, Stand, ICashier, CashierCut, Order } from '@core/models/index';
import Dexie, { EntityTable } from 'dexie';

@Injectable({
  providedIn: 'root'
})
export class DexieService extends Dexie {
  galleries!: EntityTable<Gallery, 'id'>;
  stands!: EntityTable<Stand, 'id'>;
  cashier!: EntityTable<ICashier, 'id'>;
  orders!: EntityTable<Order, 'id'>
  cashierCuts!: EntityTable<CashierCut, 'id'>;

  constructor() {
    super('CajaLaserVelozDB');
    this.version(1).stores({
      galleries: 'id, name',
      stands: 'id, internalId, name, galleryId',
      orders: 'id, correlative, cashierId, designerId, customerId, status, paymentMethod',
      cashier: 'id, fullName',
      cashierCuts: 'id, cashierId, openingTime, closingTime, status'
    });

    this.on('ready', () => this.seedData());
  }

  private async seedData() {
    const galleryCount = await this.galleries.count();
    if (galleryCount === 0) {
      await this.galleries.add({
        "id": "0198aead-a5f0-744c-8cfb-2fc86c1537e6",
        "name": "CC Guizado Record Plaza",
        "address": "Jr. Huaraz 1717 (Altura Cdra. 9 Av. Brasil)",
        "isActive": true,
      });

      await this.stands.bulkAdd(
        [
          {
            "id": "0198afc9-4067-75b9-97a3-2c5a4cc790c0",
            "internalId": 1,
            "socialReason": "LASER VELOZ IMPORT E.I.R.L.",
            "ruc": "20610129910",
            "name": "Stand 194",
            "address": "Jr. Huaraz 1717 - Piso 1 - Interior 194",
            "phone": "995558329",
            "phoneExtra": null,
            "yape": "903095920",
            "bcpCta": "191-7075355-0-30",
            "bcpCci": "00219100707535503053",
            "email": "laser.guizado.plaza@gmail.com",
            "isActive": true,
            "galleryId": "0198aead-a5f0-744c-8cfb-2fc86c1537e6"
          },
          {
            "id": "0198afc9-407c-73db-8540-e198bc5f8c63",
            "internalId": 2,
            "socialReason": "LASER VELOZ IMPORT E.I.R.L.",
            "ruc": "20610129910",
            "name": "Stand 102a",
            "address": "Jr. Huaraz 1717 - Piso 1 - Interior 102a",
            "phone": "922951872",
            "phoneExtra": null,
            "yape": "922951872",
            "bcpCta": "191-7075355-0-30",
            "bcpCci": "00219100707535503053",
            "email": "guizado102a@gmail.com",
            "isActive": true,
            "galleryId": "0198aead-a5f0-744c-8cfb-2fc86c1537e6"
          },
          {
            "id": "0198afc9-4084-77ab-a5e8-8ba0ef6e2bae",
            "internalId": 3,
            "socialReason": "ASESORIAS GLOBALES EMPRESARIALES E.I.R.L.",
            "ruc": "20607873411",
            "name": "Stand 243",
            "address": "Jr. Orbegoso 243 - Piso 1 - Interior 243",
            "phone": "970899806",
            "phoneExtra": null,
            "yape": "970899806",
            "bcpCta": "191-2536428-0-83",
            "bcpCci": "00219100253642808351",
            "email": "laser.guizado.plaza@gmail.com",
            "isActive": true,
            "galleryId": "0198aead-a5f0-744c-8cfb-2fc86c1537e6"
          }
        ]
      )
    }
  }
}
