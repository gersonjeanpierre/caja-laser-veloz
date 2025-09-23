import { inject, Injectable } from '@angular/core';
import { DexieService } from '@shared/idb-dexiejs/dexie-service';
import { CashierModel } from '@core/models/cashier.model';
import { v7 as uuidv7 } from 'uuid';
import { CashierCut } from '@core/models';

@Injectable({
  providedIn: 'root'
})
export class CashierService {
  private cashier = inject(DexieService).cashier;
  private cashierCuts = inject(DexieService).cashierCuts;
  private payments = inject(DexieService).payments;

  createCashier(cashier: CashierModel) {
    cashier.id = uuidv7();
    return this.cashier.add(cashier);
  }

  getAllCashiers() {
    return this.cashier.toArray();
  }

  /**
     * Abre una nueva caja.
     * @param cashierId El ID del cajero que abre la caja.
     * @param initialAmount El monto inicial.
     */
  async openCashier(cashierId: string, initialAmount: number): Promise<void> {
    const newCashierCut: CashierCut = {
      cashierId,
      openingTime: new Date(),
      closingTime: new Date(),
      openingAmount: initialAmount,
      closingAmount: 0,
      totalSales: 0,
      salesByPaymentMethod: {},
      expenses: [],
      notes: 'Apertura de caja',
      status: 'OPEN'
    };
    await this.cashierCuts.add(newCashierCut);
  }



  /**
   * Realiza un corte de caja.
   * @param cashierId El ID del cajero.
   * @param closingAmount El monto final contado.
   * @param expenses Los gastos del período.
   */
  async makeCashierCut(cashierId: string, closingAmount: number, expenses: CashierCut['expenses'] = []) {
    // 1. Encontrar el último corte de caja del cajero
    const lastCut = await this.cashierCuts
      .where('cashierId')
      .equals(cashierId)
      .last();

    const startTime: Date = lastCut && lastCut.closingTime ? lastCut.closingTime : new Date(new Date().setHours(0, 0, 0, 0));

    // 2. Obtener los pagos realizados desde el último corte
    const paymentsInPeriod = await this.payments
      .where('createdAt')
      .between(startTime, new Date())
      .toArray();

    // 3. Calcular los totales de ingresos
    let totalPayments = 0;
    const paymentsByMethod: { [key: string]: number } = {};

    paymentsInPeriod.forEach(payment => {
      totalPayments += payment.amount;
      paymentsByMethod[payment.paymentMethod] = (paymentsByMethod[payment.paymentMethod] || 0) + payment.amount;
    });

    // 4. Calcular el total de gastos
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);

    // 5. Crear el nuevo registro del corte de caja
    const newCut: CashierCut = {
      cashierId,
      openingTime: startTime,
      closingTime: new Date(),
      openingAmount: lastCut?.closingAmount || 0,
      closingAmount,
      totalSales: totalPayments,
      salesByPaymentMethod: paymentsByMethod,
      expenses,
      notes: 'Corte de caja',
      status: 'CLOSED'
    };

    const newCutId = await this.cashierCuts.add(newCut);
    return [{ ...newCut, id: newCutId }, totalExpenses];
  }



  /**
   * Obtiene todos los cortes de caja de un cajero.
   * @param cashierId El ID del cajero.
   */
  async getCashierCuts(cashierId: string): Promise<CashierCut[]> {
    return this.cashierCuts
      .where('cashierId')
      .equals(cashierId)
      .sortBy('closingTime');
  }
}
