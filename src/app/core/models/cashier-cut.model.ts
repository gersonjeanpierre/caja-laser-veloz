export interface CashierCut {
  id?: string; // UUID
  cashierId: string;
  openingTime: Date;
  closingTime?: Date;
  openingAmount: number; // Saldo inicial 
  closingAmount?: number; // Saldo final 
  totalSales: number;
  salesByPaymentMethod: {
    [key: string]: number; // Ej: { efectivo: 500, tarjeta: 1200 }
  };
  expenses: {
    description: string;
    amount: number;
  }[];
  notes?: string; // Observaciones del cajero
  status: 'OPEN' | 'CLOSED'; // Indica si la caja está abierta o cerrada
}