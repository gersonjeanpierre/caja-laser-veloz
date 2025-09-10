import { PaymentMethod } from "@core/interface/payment-method.interface";

export const paymentMethods: PaymentMethod[] = [
  { label: 'Efectivo', value: 'CASH' },
  { label: 'Tarjeta de Crédito', value: 'CREDIT_CARD' },
  { label: 'Tarjeta de Débito', value: 'DEBIT_CARD' },
  { label: 'Yape', value: 'YAPE' },
  { label: 'Transferencia Bancaria', value: 'BANK_TRANSFER' },
];
