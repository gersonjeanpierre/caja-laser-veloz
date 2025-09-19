export interface Sale {
  id?: string;
  correlative: number;
  standId: string;
  cashierId: string;
  designerId: string;
  designerName?: string;
  createdAt: Date;
  updateAt?: Date;
  paymentMethod: string;
  customerId: string;
  phone?: string;
  items?: any[];
  statusProduct: string;
  statusSale: string;
  notes?: string;
  generateInvoice: boolean;
  isIgv: boolean;
  saleSubtotal: number;
  advancePayment?: number;
  discount?: number;
  saleValue: number;
  igv?: number;
  totalAmount: number;
  isActive: boolean;
}