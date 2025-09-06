export interface Order {
  id?: string;
  correlative: number;
  cashierId: string;
  designerId: string;
  createdAt: Date;
  updateAt: Date;
  paymentMethod: string;
  customerId: string;
  items?: any[];
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  generateInvoice: boolean;
  isIgv: boolean;
  saleSubtotal: number;
  advancePayment?: number;
  discount?: number;
  saleValue: number;
  igv?: number;
  totalAmount: number;
}