import { inject, Injectable } from '@angular/core';
import { SaleModel } from '@core/models/sale.model';
import { DexieService } from '@shared/idb-dexiejs/dexie-service';
import { v7 as uuidv7 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private saleService = inject(DexieService).sales;
  private paymentsService = inject(DexieService).payments;

  createNewTicket(sale: SaleModel) {
    const saleWithId = {
      ...sale,
      id: uuidv7()
    };

    return this.saleService.add(saleWithId);
  }

  getSales() {
    return this.saleService.toArray();
  }

  getSaleById(id: string) {
    return this.saleService.get(id);
  }

  updateSale(id: string, changes: Partial<SaleModel>) {
    return this.saleService.update(id, changes);
  }
} 
