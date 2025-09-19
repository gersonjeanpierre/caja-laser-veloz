export interface PaymentModel {
  id?: string;
  saleId: string;
  cashierId: string;
  amount: number;
  paymentMethod: string;
  createdAt: Date;
}