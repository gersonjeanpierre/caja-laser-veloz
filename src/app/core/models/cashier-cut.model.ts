// Asegúrate de importar tus interfaces si están en archivos separados
import { Sale } from "./sale.model";

export interface CashierCut {
  id?: string; // UUID
  cashierId: string; // ID del cajero que abrió/cerró la caja
  openingTime: Date; // Momento en que se abrió la caja para este corte
  closingTime?: Date; // Momento en que se cerró la caja (opcional hasta que se cierre)
  openingAmount: number; // Saldo inicial al abrir la caja
  closingAmount?: number; // Saldo final al cerrar la caja (calculado o ingresado)
  totalSales: number; // Suma de totalAmount de las órdenes del período
  salesByPaymentMethod: {
    [key: string]: number; // Ej: { efectivo: 500, tarjeta: 1200 }
  };
  expenses: {
    description: string;
    amount: number;
  }[];
  notes?: string; // Observaciones del cajero
  status: 'OPEN' | 'CLOSED'; // Indica si la caja está abierta o cerrada
  orders: Sale[]; // Lista de órdenes procesadas durante este corte
}