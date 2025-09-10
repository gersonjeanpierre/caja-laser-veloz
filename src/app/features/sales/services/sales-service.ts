import { inject, Injectable } from '@angular/core';
import { Sale } from '@core/models/sale.model';
import { DexieService } from '@shared/idb-dexiejs/dexie-service';
import { v7 as uuidv7 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private saleService = inject(DexieService).sales;

  createNewTicket(sale: Sale) {
    const saleWithId = { ...sale, id: uuidv7() };
    return this.saleService.add(saleWithId);
  }

  getSales() {
    return this.saleService.toArray();
  }

  getSaleById(id: string) {
    return this.saleService.get(id);
  }

  updateSale(id: string, changes: Partial<Sale>) {
    return this.saleService.update(id, changes);
  }
} 
