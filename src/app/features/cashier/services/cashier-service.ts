import { inject, Injectable } from '@angular/core';
import { DexieService } from '@shared/idb-dexiejs/dexie-service';
import { ICashier } from '@core/models/cashier.model';
import { v7 as uuidv7 } from 'uuid';
import { CashierCut } from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class CashierService {
  private cashier = inject(DexieService).cashier;
  private cashierCuts = inject(DexieService).cashierCuts;
  private payments = inject(DexieService).payments;

  createCashier(cashier: ICashier) {
    cashier.id = uuidv7();
    return this.cashier.add(cashier);
  }

  getAllCashiers() {
    return this.cashier.toArray();
  }

  async openCashier(cashierId: string, initialAmount: number) {
    const id = uuidv7();



  }

}
