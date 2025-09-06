import { inject, Injectable } from '@angular/core';
import { DexieService } from 'src/app/dexie-service';
import { ICashier } from '@core/models/cashier.model';
import { v7 as uuidv7 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class CashierService {
  private cashier = inject(DexieService).cashier;

  createCashier(cashier: ICashier) {
    cashier.id = uuidv7();
    return this.cashier.add(cashier);
  }

  getAllCashiers() {
    return this.cashier.toArray();
  }

}
