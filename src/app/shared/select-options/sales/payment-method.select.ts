import { ISelectPrimeNG } from "@core/interface/select-primeng.interface";

export const paymentMethods: ISelectPrimeNG[] = [
  { label: 'Efectivo', value: 'Efectivo', image: '/images/efectivo.svg' },
  { label: 'Tarjeta de Cred/Debito', value: 'Tarjeta de Cred/Debito', image: '/images/tarjeta.svg' },
  { label: 'Yape', value: 'Yape', image: '/images/yape.svg' },
  { label: 'Transferencia Bancaria', value: 'Transferencia Bancaria', image: '/images/deposito.svg' },
];
